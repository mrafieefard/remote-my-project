from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from sqlalchemy import JSON, DateTime
import random
from datetime import datetime
import uuid

class Base(DeclarativeBase):

    pass


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(default="",primary_key=True)
    description: Mapped[str] = mapped_column(default="")
    functions: Mapped[JSON] = mapped_column(type_=JSON, default=[])
    secret: Mapped[str] = mapped_column(default="".join(
        [random.choice("abcde1234567890") for _ in range(32)]), primary_key=True)
    create_at: Mapped[int] = mapped_column(
        default=int(datetime.now().timestamp()))
    active_time: Mapped[int] = mapped_column(default=0)
    is_active : Mapped[bool] = mapped_column(default=False)
    is_ready: Mapped[bool] = mapped_column(default=False)

    def calc_uptime(self,additional_time):
        return round(100 * (self.active_time + additional_time) / (datetime.now().timestamp() - self.create_at),2),

    def get_data(self,additional_time=0):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "functions": self.functions,
            "secret": self.secret,
            "create_at": self.create_at,
            "active_time": self.active_time,
            "up_time": self.calc_uptime(additional_time),
            "is_active": self.is_active,
            "is_ready": self.is_ready
        }


class Log(Base):
    __tablename__ = "logs"

    id: Mapped[str] = mapped_column(primary_key=True)
    project_id: Mapped[str]
    project_name: Mapped[str]
    level: Mapped[str]
    create_at: Mapped[int]
    content: Mapped[str]

    def time_ago(self):
        # Convert timestamp to datetime object
        timestamp_dt = datetime.fromtimestamp(self.create_at)
        
        # Calculate the time difference
        time_diff = datetime.now() - timestamp_dt
        
        # Get time difference in seconds
        seconds = time_diff.total_seconds()
        
        # Define time units in seconds
        units = [
            ('year', 365*24*60*60),
            ('month', 30*24*60*60),
            ('week', 7*24*60*60),
            ('day', 24*60*60),
            ('hour', 60*60),
            ('minute', 60),
            ('second', 1)
        ]
        
        # Iterate through time units to find the appropriate one
        for unit, seconds_per_unit in units:
            interval = seconds // seconds_per_unit
            if interval > 0:
                if interval == 1:
                    return f"{int(interval)} {unit} ago"
                else:
                    return f"{int(interval)} {unit}s ago"
        
        # If timestamp is in the future
        return "Just now"

    def get_data(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "project_name": self.project_name,
            "level": self.level,
            "create_at": self.create_at,
            "time_ago" : self.time_ago(),
            "content": self.content,
            
        }
    

class Client(Base):
    __tablename__ = "clients"

    id: Mapped[str] = mapped_column(primary_key=True,default=str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(primary_key=True)
    hashed_password: Mapped[str] = mapped_column()

    def get_data(self):
        return {
            "id": self.id,
            "username": self.username,
            "hashed_password": self.hashed_password,
        }
