import random
from fastapi import APIRouter, WebSocket, Response, status, Depends, Header, HTTPException, status, Request
from fastapi.responses import JSONResponse
from base_models import CreateProject, LoginForm, Token, UpdateProject, GetLogsForm
from websocket_manager import websocket_handler, ClientWebsocket
from db import *
from client_authentication import *
from common import calculate_total_pages, convert_level, get_page_content
import uuid

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from datetime import timedelta
from typing import Annotated, Union


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


@route.get("/projects")
async def get_projects(search: str, current_user: Annotated[Client, Depends(http_auth)]):
    projects = db_get_projects()
    search_lower = search.lower()
    datas = []
    for data in projects:
        if not search or search_lower in data.id.lower() or search_lower in data.title.lower() or search_lower in data.description.lower():
            project_connection = websocket_handler.get_connected_project(
                data.id)
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

        if data == "unique":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Invalid name for project")

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
        db_delete_all_widget(id)
        return {
            "success": True,
        }
    else:
        raise HTTPException(status_code=400, detail="Project not found")


@route.post("/project")
async def create_project(json_data: CreateProject, current_user: Annotated[Client, Depends(http_auth)]):
    new_project = db_create_project(
        str(uuid.uuid4()), json_data.title, json_data.description)
    if new_project:
        if new_project == "unique":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Invalid name for project")
        return new_project.get_data()


@route.post("/logs")
async def get_project_log(payload: GetLogsForm, current_user: Annotated[Client, Depends(http_auth)]):
    logs = db_get_logs()

    logs_dict = []
    for log in logs:
        if (convert_level(log.level) in list(map(str.lower, payload.level)) or payload.level == "all") and (log.project_id in payload.project or payload.project == "all") and (not payload.search or payload.search.lower() in log.content.lower()):
            logs_dict.append(log.get_data())
    logs_dict.reverse()
    total_pages = calculate_total_pages(len(logs_dict), payload.size)
    data = get_page_content(logs_dict, payload.page, payload.size)

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

    return logs.get_data()



@route.get("/widgets")
async def get_widgets(current_user: Annotated[Client, Depends(http_auth)]):
    widgets = db_get_widgets()

    return [widget.get_data() for widget in widgets]

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
