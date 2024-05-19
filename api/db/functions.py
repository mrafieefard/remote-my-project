import random
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
import uuid
from datetime import datetime

from .models import Base, Project, Log, Client
from .base import conn, session


Base.metadata.create_all(bind=conn)


def db_create_project(id, title, description) -> Project:
    try :
        project = Project(id=id, title=title, description=description, secret="".join(
            [random.choice("abcde1234567890") for _ in range(32)]))
        session.add(project)
        session.commit()

        return project
    except IntegrityError:
        return "unique"
    except:
        return False
    finally :
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
        return "unuque"
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


def db_get_client(username):
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
