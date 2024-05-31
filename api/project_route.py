from fastapi import APIRouter, WebSocket, Response, status,Depends,Header,HTTPException
from typing_extensions import Annotated
from base_models import UpdateFunction, UpdateProgressWidget,UpdateReady, UpdateTextWidget, UpdateTimeWidget, UpdateWidgets
from websocket_manager import websocket_handler, ProjectWebsocket
from db import *

import uuid

route = APIRouter(prefix="/app",
                  responses={404: {"error": "Not found"}})

async def verify_secret(project_id: Annotated[str, Header()],secret: Annotated[str, Header()]):
    project = db_get_project(project_id)
    if not project : raise HTTPException(401,detail="Unauthorized")
    if project.secret != secret:
        raise HTTPException(401,detail="Unauthorized")
    return project

@route.get("/project/{id}")
async def get_project(id: str, response: Response,project : Annotated[Project, Depends(verify_secret)]):

    return project





@route.post("/project/{id}/functions")
async def sync_functions(id: str, payload: UpdateFunction, response: Response,project : Annotated[Project, Depends(verify_secret)]):

    project.functions = payload.function
    data = db_update_project(id, project)

    return data

@route.post("/project/{id}/widgets")
async def sync_widgets(id: str, payload: UpdateWidgets, response: Response,project : Annotated[Project, Depends(verify_secret)]):
    db_delete_all_widget(id)
    for widget in payload.widget:

        db_create_widget(widget["name"],id,widget["title"],widget["type"],widget["content"])

    return

@route.put("/widget/text/{name}")
async def update_text_widget(name: str, payload: UpdateTextWidget, response: Response,project : Annotated[Project, Depends(verify_secret)]):
    widget = db_get_widget(name)

    if not widget :
        raise HTTPException(status.HTTP_404_NOT_FOUND,"Widget not found")
    
    if widget.type != 0:
        raise HTTPException(status.HTTP_403_FORBIDDEN,f"{name.capitalize()} its not a text widget")
    
    data = db_update_widget(name,{
        "text" : payload.text
    })
    

    return data

@route.put("/widget/progress/{name}")
async def update_progress_widget(name: str, payload: UpdateProgressWidget, response: Response,project : Annotated[Project, Depends(verify_secret)]):
    widget = db_get_widget(name)

    if not widget :
        raise HTTPException(status.HTTP_404_NOT_FOUND,"Widget not found")
    
    if widget.type != 1:
        raise HTTPException(status.HTTP_403_FORBIDDEN,f"{name.capitalize()} its not a progress widget")
    
    data = db_update_widget(name,{
        "amont" : payload.amont
    })
    

    return data

@route.put("/widget/time/{name}")
async def update_time_widget(name: str, payload: UpdateTimeWidget, response: Response,project : Annotated[Project, Depends(verify_secret)]):
    widget = db_get_widget(name)

    if not widget :
        raise HTTPException(status.HTTP_404_NOT_FOUND,"Widget not found")
    
    if widget.type != 2:
        raise HTTPException(status.HTTP_403_FORBIDDEN,f"{name.capitalize()} its not a progress widget")
    
    data = db_update_widget(name,{
        "timestamp" : payload.timestamp
    })
    

    return data


@route.put("/project/{id}/ready")
async def update_ready(id: str, payload: UpdateReady, response: Response,project : Annotated[Project, Depends(verify_secret)]):

    project.is_ready = payload.is_ready

    data = db_update_project(id, project)

    return {"is_ready" : data.is_ready}


@route.websocket("/project/{id}/ws",dependencies=[Depends(verify_secret)])
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
