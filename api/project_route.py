from fastapi import APIRouter, WebSocket, Response, status,Depends,Header,HTTPException
from typing_extensions import Annotated
from base_models import UpdateFunction,UpdateReady
from websocket_manager import websocket_handler, ProjectWebsocket
from db import *

import uuid

route = APIRouter(prefix="/project",
                  responses={404: {"error": "Not found"}})

async def verify_secret(id : str,secret: Annotated[str, Header()]):
    project = db_get_project(id)
    if not project : raise HTTPException(401,detail="Unauthorized")
    if project.secret != secret:
        raise HTTPException(401,detail="Unauthorized")
    return project

@route.get("/{id}")
async def get_project(id: str, response: Response,project : Annotated[Project, Depends(verify_secret)]):

    return project





@route.post("/{id}/functions")
async def sync_functions(id: str, payload: UpdateFunction, response: Response,project : Annotated[Project, Depends(verify_secret)]):

    project.functions = payload.function
    data = db_update_project(id, project)

    return data

@route.put("/{id}/ready")
async def update_ready(id: str, payload: UpdateReady, response: Response,project : Annotated[Project, Depends(verify_secret)]):

    project.is_ready = payload.is_ready

    data = db_update_project(id, project)

    return {"is_ready" : data.is_ready}


@route.websocket("/{id}/ws",dependencies=[Depends(verify_secret)])
async def project_websocket(websocket: WebSocket, id: str):
    await websocket.accept()
    websocket_project = ProjectWebsocket(id, websocket,)
    await websocket_handler.add_project_connection(websocket_project)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket_project.handle_data(data)
    except:
        if db_get_project(id):
            await websocket_handler.remove_project_connection(websocket_project)
