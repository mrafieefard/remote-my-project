from python import Client,Context,Function,Argument
from python.types import String,Log

import time

def print_function(ctx : Context,text):
    for x in range(10):
        print(text)
        time.sleep(1)
    ctx.close_group("Finish")

def run(client : Client):
    client.websocket.send_ready(False)
    client.send_log(Log.ERROR,f"This is test log")
    client.send_log(Log.INFO,f"This is test log")
    client.send_log(Log.DEBUG,f"This is test log")
    client.send_log(Log.WARNING,f"This is test log")
    

client = Client("127.0.0.1:8000","0399c4e4-cde6-4ce5-bd45-0b89f693bc32","98cd0d6420b44be6193b2de46bc7b057",[
    Function("print",print_function,(
        Argument("text",String),
    ))
],run,reconnect=True,reconnect_delay=5)

client.run()