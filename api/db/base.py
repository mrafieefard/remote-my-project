from sqlalchemy import create_engine
from sqlalchemy.orm import Session

DATABASE_URL = "postgresql://postgres:postgres@rmp-database/rmpdb"

engine = create_engine(DATABASE_URL)

session = Session(bind=engine)
