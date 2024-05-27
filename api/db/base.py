from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import os

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL = "postgresql://test:test@localhost/rmpdb"
engine = create_engine(DATABASE_URL)

session = Session(bind=engine)
