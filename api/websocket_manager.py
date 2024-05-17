from fastapi import WebSocket
import uuid
import json
from typing import Literal
from datetime import datetime

from db import db_update_project, db_get_project,db_create_log


class ClientWebsocket:
    client_id: str
    websocket: WebSocket

    def __init__(self, client_id, websocket) -> None:
        self.client_id = client_id
        self.websocket = websocket
        

    async def send_data(self, type, data):
        await self.websocket.send_json({
            "type": type,
            "data": data
        })

    async def send_error(self, error):
        await self.send_data(400,{
            "error" : error
        })

    async def handle_data(self, data: str):
        json_data: dict = json.loads(data)
        match json_data.get("type"):
            case 200:
                project_id = json_data.get("data").get("project_id")
                project = websocket_handler.get_ready_project(project_id)
                group = websocket_handler.create_group(project, self)

                function = json_data.get("data").get("function")
                arguments = json_data.get("data").get("arguments")

                if project:
                    await self.send_data(0,{
                        "gid": group
                    })

                    await project.send_data(1, {
                        "function": function,
                        "arguments" : arguments,
                        "gid": group
                    })

                else:
                    await self.send_error("Project not exist or not active")
            case 299:
                gid = json_data.get("data").get("gid")
                reason = json_data.get("data").get("reason")

                await websocket_handler.close_group(gid,reason,False)
            case _:
                await self.send_error("Invalid data type")

class ProjectWebsocket:
    project_id: str
    websocket: WebSocket
    connect_time : datetime

    def __init__(self, project_id, websocket) -> None:
        self.project_id = project_id
        self.websocket = websocket
        self.connect_time = datetime.now()
        self.project = db_get_project(self.project_id)

    def update_project_ready(self, is_ready: bool):
        project = db_get_project(self.project_id)
        project.is_ready = is_ready
        db_update_project(self.project_id, project)

    def update_project_active(self, is_active: bool):
        project = db_get_project(self.project_id)
        project.is_active = is_active
        db_update_project(self.project_id, project)

    async def send_data(self, type, data):
        await self.websocket.send_json({
            "type": type,
            "data": data
        })

    async def send_error(self, error):
        await self.send_data(400,{
            "error" : error
        })

    async def handle_data(self, data: str):
        
        json_data: dict = json.loads(data)
        type = json_data.get("type")
        data : dict = json_data.get("data",{})
        match type:
            case 100:
                ready = data.get("ready")
                self.update_project_ready(ready)
            case 200:
                message = data.get("message")
                project = db_get_project(self.project_id)
                websocket_handler.send_all_clients({
                    "project": {"id": project.id, "name": project.title},
                    "message": message
                })
            case 201:

                gid = data.get("gid")
                message = data.get("message")
                group = websocket_handler.get_group(gid)

                if group:
                    await group.client_websocket.websocket.send_json({
                        "type": 2,
                        "data": {
                            "gid": gid,
                            "message": message
                        }
                    })
                else:
                    await self.send_error("Group not found")
            case 299:
                gid = data.get("gid")
                reason = data.get("reason")

                await websocket_handler.close_group(gid,reason,True)
            case 300:
                level = data.get("level")
                content = data.get("content")
                
                db_create_log(self.project_id,self.project.title,level,content)
            case _:
                await self.send_error("Invalid data type")
            
class WebsocketGroup:
    gid: str
    client_websocket: ClientWebsocket
    project_websocket: ProjectWebsocket

    def __init__(self, project_websocket: ProjectWebsocket, client_websocket: ClientWebsocket) -> None:
        self.gid = str(uuid.uuid4())
        self.client_websocket = client_websocket
        self.project_websocket = project_websocket


class WebsocketHandler:
    def __init__(self) -> None:
        self.active_client_conn: list[ClientWebsocket] = []
        self.active_project_conn: list[ProjectWebsocket] = []
        self.groups: list[WebsocketGroup] = []

    async def add_client_connection(self, connection: ClientWebsocket):
        self.active_client_conn.append(connection)

    async def add_project_connection(self, connection: ProjectWebsocket):
        connection.update_project_active(True)
        self.active_project_conn.append(connection)

    async def remove_client_connection(self, connection: ProjectWebsocket):
        self.active_client_conn.remove(connection)

    async def force_remove_project_connection(self , connection : ProjectWebsocket):
        await connection.websocket.close(reason="Project deleted")
        self.active_project_conn.remove(connection)

    async def remove_project_connection(self, connection: ProjectWebsocket):
        online_time = datetime.now().timestamp() - connection.connect_time.timestamp()
        project = db_get_project(connection.project_id)
        project.active_time = int(online_time)
        db_update_project(connection.project_id,project)
        
        connection.update_project_ready(False)
        connection.update_project_active(False)

        self.active_project_conn.remove(connection)

    async def send_all_clients(self, data: dict):
        for client in self.active_client_conn:
            await client.websocket.send_json({
                "type": 1,
                "data": data
            })

    def get_connected_project(self,project_id):
        for active_project in self.active_project_conn:
            if active_project.project_id == project_id:
                return active_project

        return

    def get_ready_project(self, project_id):
        project = db_get_project(project_id)
        if not project:
            return
        if not project.is_ready:
            return

        for active_project in self.active_project_conn:
            if active_project.project_id == project_id:
                return active_project

        return

    def create_group(self, project, client):
        group = WebsocketGroup(project, client)

        self.groups.append(
            group
        )

        return group.gid

    def get_group(self, gid) -> WebsocketGroup | None:
        for group in websocket_handler.groups:
            if group.gid == gid:
                return group
        return
    
    async def close_group(self,gid,reason,is_project):
        group = self.get_group(gid)
        await group.client_websocket.send_data(2,{"gid" : gid,"reason" : reason,"is_project" : is_project})
        await group.project_websocket.send_data(2,{"gid" : gid,"reason" : reason,"is_project" : is_project})

        self.groups.remove(group)
    


websocket_handler = WebsocketHandler()
