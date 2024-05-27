from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import os

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
else :
    engine = create_engine("sqlite:///rmp.db",connect_args={"check_same_thread": False})
conn = engine.connect()

session = Session(bind=engine)