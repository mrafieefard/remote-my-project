from typing import Literal,Callable
from .types import Type

class Argument:
    def __init__(self,name,type : Type) -> None:
        self.name = name
        self.type = type

    def get_dict(self):
        return {
            "name" : self.name,
            "type" : self.type.type_name
        }

class Function:
    def __init__(self,name,function : Callable,args : tuple[Argument]) -> None:
        self.name = name
        self.function = function
        self.args = args

    def get_dict(self):
        return{
            "name" : self.name,
            "function" : self.function.__name__,
            "args" : [arg.get_dict() for arg in self.args]
        }
    
class Context:
    def __init__(self,client,gid) -> None:
        self.client = client
        self.gid = gid

    def send_group_message(self,message):
        self.client.websocket.send_data(
            201,{
                "gid" : self.gid,
                "message" : message
            }
        )

    def close_group(self,reason):
        self.client.websocket.close_group(
            self.gid,reason
        )

    def send_log(self,level,content):
        self.client.websocket.send_data(
            300,{
                "project_id" : self.client.project_id,
                "debug_type" : level,
                "content" : content
            }
        )