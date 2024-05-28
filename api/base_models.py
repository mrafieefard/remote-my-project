from pydantic import BaseModel


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

