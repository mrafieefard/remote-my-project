import random
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
import uuid
from datetime import datetime

from .models import Base, Project, Log, Client, Widget
from .base import engine, session


Base.metadata.create_all(bind=engine)


def db_create_project(id, title, description) -> Project:
    try:
        secret = "".join(
            [random.choice("abcde1234567890") for _ in range(32)])
        project = Project(id=id, title=title,
                          description=description, secret=secret)
        session.add(project)
        session.commit()

        return project
    except IntegrityError:
        return "unique"
    except:
        return False
    finally:
        session.rollback()


def db_get_projects() -> list[Project]:
    stmt = select(Project)
    data = session.scalars(stmt)

    return data.fetchall()


def db_get_project(id) -> Project | None:
    stmt = select(Project).where(Project.id == id)
    data = session.scalars(stmt)

    return data.first()


def db_update_project(id, new_project: Project) -> Project | None:
    try:
        project = session.query(Project).where(Project.id == id).first()

        if not project:
            return

        project.title = new_project.title
        project.description = new_project.description
        project.functions = new_project.functions
        project.secret = new_project.secret
        project.is_ready = new_project.is_ready

        session.commit()

        return project

    except IntegrityError:
        return "unique"
    except:
        return False
    finally:
        session.rollback()


def db_delete_project(id) -> bool:
    project = db_get_project(id)
    if not project:
        return

    session.delete(project)
    session.commit()

    return True


def db_create_log(project_id, project_name, level, content):
    id = str(uuid.uuid4())
    now = datetime.now()
    log = Log(id=id, project_id=project_id, project_name=project_name,
              level=level, create_at=now.timestamp(), content=content)
    session.add(log)
    session.commit()

    return log


def db_get_log(log_id):
    log = session.query(Log).where(Log.id == log_id)

    return log.first()


def db_get_logs():
    stmt = select(Log)
    data = session.scalars(stmt)

    return data.fetchall()


def db_delete_log(id) -> bool:
    log = db_get_log(id)

    if not log:
        return

    session.delete(log)
    session.commit()

    return True


def db_delete_logs(project_id):
    session.query(Log).where(Log.project_id == project_id).delete()
    session.commit()

    return True


def db_clear_logs():
    session.query(Log).where().delete()
    session.commit()

    return True


def db_update_log_project_name(project_id):
    project = db_get_project(project_id)
    if not project:
        return

    session.query(Log).where(Log.project_id == project_id).update(
        {Log.project_name: project.title}, synchronize_session=False
    )
    return True


def db_get_user(id):
    client = session.query(Client).where(Client.id == id)

    return client.first()

def db_get_user_by_username(username):
    client = session.query(Client).where(Client.username == username)

    return client.first()

def db_get_clients():
    clients = select(Client)
    data = session.scalars(clients)

    return data.fetchall()


def db_create_client(username, password):
    client = Client(username=username, hashed_password=password)

    session.add(client)
    session.commit()


def db_create_widget(name, project_id, title, type, content):
    try:
        widget = Widget(id=str(uuid.uuid4()), name=name, title=title,
                        project_id=project_id, type=type, content=content)
        session.add(widget)
        session.commit()
    except:
        return False
    finally:
        session.rollback()

def db_get_widgets():
    stmt = select(Widget)
    data = session.scalars(stmt)

    return data.fetchall()

def db_get_widget(name):
    widget = session.query(Widget).where(Widget.name == name)

    return widget.first()

def db_update_widget(name,content):
    widget = db_get_widget(name)
    if not widget:
        return

    widget.content = content

    session.commit()

    return widget


def db_delete_all_widget(project_id):
    session.query(Widget).where(Widget.project_id == project_id).delete()

    session.commit()

def db_get_users():
    stmt = select(Client)
    data = session.scalars(stmt)

    return data.fetchall()

def db_create_user(username,password):
    try:
        project = Client(id=str(uuid.uuid4), username=username,
                          hashed_password=password)
        session.add(project)
        session.commit()

        return project
    except IntegrityError:
        return "unique"
    except:
        return False
    finally:
        session.rollback()

def db_delete_user(username) -> bool:
    user = db_get_user(username)

    if not user:
        return

    session.delete(user)
    session.commit()

    return True

def db_update_user(id, new_user: Client) -> Client | None:
    try:
        user = session.query(Client).where(Client.id == id).first()

        if not user:
            return

        user.username = new_user.username
        user.hashed_password = new_user.hashed_password
        
        session.commit()

        return user

    except IntegrityError:
        return "unique"
    except:
        return False
    finally:
        session.rollback()