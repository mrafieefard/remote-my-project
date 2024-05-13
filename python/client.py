from socket import socket
import websocket
from websocket import WebSocket
import logging
import json
from .types import Log
from colorama import Fore
from threading import Thread
from requests import Session
from .exceptions import NotEnoughArgs
from .utilities import Function, Context
from typing import Callable, Any
import time

logging.basicConfig(level=logging.INFO, format=f'{Fore.BLUE}[ %(levelname)s ] [ %(asctime)s ] {
                    Fore.RESET}%(message)s', datefmt=f'{Fore.CYAN}%m/%d/%Y %I:%M:%S %p{Fore.BLUE}')


class Websocket(websocket.WebSocketApp):

    def __init__(self, url: str, header: list | dict | Callable[..., Any] | None = None, reconnect_delay: int = 5, on_open: Callable[[WebSocket], None] | None = None, on_reconnect: Callable[[WebSocket], None] | None = None, on_message: Callable[[WebSocket, Any], None] | None = None, on_error: Callable[[WebSocket, Any], None] | None = None, on_close: Callable[[WebSocket, Any, Any], None] | None = None, on_ping: Callable[..., Any] | None = None, on_pong: Callable[..., Any] | None = None, on_cont_message: Callable[..., Any] | None = None, keep_running: bool = True, get_mask_key: Callable[..., Any] | None = None, cookie: str | None = None, subprotocols: list | None = None, on_data: Callable[..., Any] | None = None, socket: socket | None = None) -> None:
        self.reconnect_delay = reconnect_delay
        super().__init__(url, header, on_open, on_reconnect, on_message, on_error, on_close, on_ping,
                         on_pong, on_cont_message, keep_running, get_mask_key, cookie, subprotocols, on_data, socket)

    def send_data(self, type, data={}):
        self.send(
            json.dumps({
                "type": type,
                "data": data
            })
        )
        logging.debug(f"[Send] type : {type} data : {data}")

    def send_error(self, error):
        self.send_data(400, {
            "error": error
        })

    def close_group(self, gid, reason):
        self.send_data(299, {"gid": gid, "reason": reason})

    def send_ready(self, is_ready):
        self.send_data(100, {
            "ready": is_ready
        })

    def reconnect(self):
        self.run_forever(reconnect=self.reconnect_delay)


class Client:
    def __init__(self, base_address, project_id, secret, functions: list[Function], run_function: Callable = None, reconnect_delay: int = 5, reconnect: bool = False) -> None:
        self.base_address = base_address
        self.project_id = project_id
        self.secret = secret
        self.functions = functions
        self.reconnect_delay = reconnect_delay
        self.reconnect = reconnect
        self.header = {
            "secret": secret
        }
        self.websocket = Websocket(f"ws://{self.base_address}/project/{self.project_id}/ws", header=self.header,
                                   on_open=self.on_connect, on_message=self.on_data, on_close=self.on_disconnect, on_reconnect=self.on_reconnect,reconnect_delay=self.reconnect_delay)
        self.session = Session()
        self.session.headers = self.header
        self.run_function = run_function

    def execute_function(self, function: Function, arguments: dict, gid):
        args = {}
        for arg in function.args:
            if arg.name in list(arguments.keys()):
                if type(arguments[arg.name]).__name__ != arg.type.type_name:
                    raise NotEnoughArgs
                args[arg.name] = arguments[arg.name]

            else:
                raise NotEnoughArgs
        context = Context(self, gid)
        Thread(target=function.function, args=(context,), kwargs=args).start()

    def authentication(self):
        request = self.session.get(
            f"http://{self.base_address}/project/{self.project_id}")
        if request.status_code == 200:
            logging.info("Authentication sucsess")
            return True
        else:
            logging.error("Faild authentication")
            return False

    def sync_functions(self):
        request = self.session.post(f"http://{self.base_address}/project/{self.project_id}/functions", json={
            "function": [function.get_dict() for function in self.functions]
        })
        if request.status_code == 200:
            logging.info("Functions synced")
            return True
        else:
            logging.error("Faild to sync functions")
            return False

    def send_log(self, level: Log, content):
        self.websocket.send_data(
            300, {
                "level": level,
                "content": content
            }
        )

    def on_reconnect(self, _):
        if not self.authentication():
            self.websocket.close()
        if not self.sync_functions():
            self.websocket.close()
        self.websocket.send_ready(True)

    def on_connect(self, _):
        self.websocket.send_ready(True)
        Thread(target=self.run_function, args=(self,)).start()

    def on_data(self, _, data):
        json_data = json.loads(data)
        type = json_data.get("type")
        data = json_data.get("data")
        logging.debug(f"[Recv] type : {type} data : {data}")
        match type:
            case 0:
                self.websocket.close()
            case 1:
                gid = data.get("gid")
                function_data = data.get("function")
                arguments_data = data.get("arguments")

                for function in self.functions:
                    if function.name == function_data:
                        try:
                            self.execute_function(
                                function, arguments_data, gid)
                        except NotEnoughArgs:
                            self.websocket.close_group(gid, "Not enough args")

    def on_disconnect(self, _, code, reason):
        logging.error(f"Disconnected : {reason if reason != "" else "No response from server"}")
        if code != 1000 and self.reconnect:
            self.websocket.reconnect()

    def run(self):
        try:
            if not self.authentication():
                return
            if not self.sync_functions():
                return
            self.websocket.run_forever(reconnect=self.reconnect_delay)
        except KeyboardInterrupt:
            self.websocket.close()
