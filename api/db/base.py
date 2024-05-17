from sqlalchemy import create_engine
from sqlalchemy.orm import Session

engine = create_engine("sqlite:///touch.db",connect_args={"check_same_thread": False})
conn = engine.connect()

session = Session(bind=engine)