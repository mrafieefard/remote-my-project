from typing import Annotated
from pydantic import BaseModel
from fastapi import Form


class CreateProject(BaseModel):
    title: str
    description: str


class UpdateProject(BaseModel):
    title: str
    description: str
    change_secret: bool


class UpdateReady(BaseModel):
    is_ready: bool


class UpdateFunction(BaseModel):
    function: list

class UpdateWidgets(BaseModel):
    widget : list

class UpdateTextWidget(BaseModel):
    text : str

class UpdateProgressWidget(BaseModel):
    amont : int

class TokenData(BaseModel):
    username: str | None = None


class Token(BaseModel):
    access_token: str


class LoginForm(BaseModel):
    username: str
    password: str


class GetLogsForm(BaseModel):
    page: int
    size: int
    level: str | list
    project: str | list
    search : str

class CreateUser(BaseModel):
    username: str
    password : str

class UpdateUser(BaseModel):
    username: str
    password: str