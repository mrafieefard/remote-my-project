from fastapi import FastAPI
import uvicorn

from project_route import route as project_route
from client_route import route as client_route

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

app.include_router(project_route)
app.include_router(client_route)

uvicorn.run(app,host="127.0.0.1",ws_ping_interval=5,ws_ping_timeout=7)