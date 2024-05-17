import random
from fastapi import APIRouter, WebSocket, Response, status, Depends, Header, HTTPException, status, Request
from fastapi.responses import JSONResponse
from base_models import CreateProject, LoginForm, Token, UpdateProject, GetLogsForm
from websocket_manager import websocket_handler, ClientWebsocket
from db import *
from client_authentication import *
from common import calculate_total_pages, get_page_content
import uuid

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from datetime import timedelta
from typing import Annotated


route = APIRouter(prefix="/client",
                  responses={404: {"error": "Not found"}})


@route.post("/token")
async def login(payload: LoginForm):
    user = authenticate_user(payload.username, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(weeks=1)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    res = JSONResponse(Token(access_token=access_token).model_dump())
    res.set_cookie(key="token", value=access_token,
                   httponly=True)

    return res


@route.get("/project")
async def get_projects(current_user: Annotated[Client, Depends(http_auth)]):
    projects = db_get_projects()
    datas = []
    for data in projects:
        project_connection = websocket_handler.get_connected_project(data.id)
        if project_connection:
            active_time = datetime.now().timestamp() - \
                project_connection.connect_time.timestamp()
            datas.append(data.get_data(additional_time=active_time))
        else:
            datas.append(data.get_data())

    return datas


@route.get("/project/{id}")
async def get_project(id: str, response: Response, current_user: Annotated[Client, Depends(http_auth)]):
    data = db_get_project(id)

    if data:
        return {
            "success": True,
            "data": data.get_data()
        }
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {
            "success": False,
            "error": "Project not found"
        }


@route.put("/project/{id}")
async def edit_project(id: str, payload: UpdateProject, response: Response):
    project = db_get_project(id)
    if not project.is_active:
        project.title = payload.title
        project.description = payload.description

        if payload.change_secret:
            project.secret = "".join(
                [random.choice("abcde1234567890") for _ in range(32)])

        data = db_update_project(id, project)
        if not data:
            raise HTTPException(
                status_code=400,
                detail="Faild to edit project"
            )
        log = db_update_log_project_name(id)
        if not log:
            raise HTTPException(
                status_code=400,
                detail="Faild to update logs"
            )
        return data
    else:
        raise HTTPException(
            status_code=400,
            detail="You cannot edit active project"
        )


@route.delete("/project/{id}")
async def delete_project(id: str, response: Response, current_user: Annotated[Client, Depends(http_auth)]):
    data = db_delete_project(id)

    if data:
        project_connection = websocket_handler.get_connected_project(id)
        if project_connection:
            await websocket_handler.force_remove_project_connection(project_connection)
        return {
            "success": True,
        }
    else:
        raise HTTPException(status_code=400, detail="Project not found")


@route.post("/project")
async def create_project(json_data: CreateProject, current_user: Annotated[Client, Depends(http_auth)]):
    new_project = db_create_project(
        str(uuid.uuid4()), json_data.title, json_data.description)
    return new_project.get_data()


@route.get("/logs")
async def get_project_log(size: int, page: int, current_user: Annotated[Client, Depends(http_auth)]):
    logs = db_get_logs()
    total_pages = calculate_total_pages(len(logs), size)
    logs = get_page_content(logs, page, size)
    data = [log.get_data() for log in logs] if logs != False else []
    sorted(data, key=lambda log: log["create_at"])
    data.reverse()
    return {"total_pages": total_pages if total_pages > 0 else 1, "data": data}


@route.delete("/logs/clear")
async def clear_all_logs(current_user: Annotated[Client, Depends(http_auth)]):
    db_clear_logs()

    return {"success": True, }


@route.delete("/log/{id}")
async def get_project_log(id: str, current_user: Annotated[Client, Depends(http_auth)]):
    logs = db_delete_log(id)
    if not logs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid log id",
        )
    return {"success": True}


@route.get("/log/{id}")
async def get_project_log(id: str, current_user: Annotated[Client, Depends(http_auth)]):
    logs = db_get_log(id)
    data = [
        {
            "level": log.level,
            "create_at": log.create_at,
            "content": log.content
        } for log in logs
    ]

    sorted(data, key=lambda log: log["create_at"])

    return {
        "success": True,
        "data": data
    }


@route.websocket("/project/{id}/ws")
async def client_websocket(websocket: WebSocket, id: str, token: Annotated[str, Header(alias="Authorization")]):
    user = await get_current_user(token)

    await websocket.accept()

    if user is False:
        await websocket.close(reason="Could not validate credentials")

    websocket_client = ClientWebsocket(id, websocket)
    websocket_handler.add_client_connection(websocket_client)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket_client.handle_data(data)
    except:
        websocket_handler.remove_client_connection(websocket_client)
