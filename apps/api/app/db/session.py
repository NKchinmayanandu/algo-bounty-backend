import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# On cloud platforms (like Render), we must be very explicit about SSL modes for psycopg2
engine_args = {
    "pool_pre_ping": True, # Automatically reconnect if connection dies
}
if DATABASE_URL and ("sslmode" not in DATABASE_URL):
    engine_args["connect_args"] = {"sslmode": "require"}
elif DATABASE_URL and "sslmode=require" in DATABASE_URL:
    # Even if it's in the string, some drivers on Linux need it in connect_args too
    engine_args["connect_args"] = {"sslmode": "require"}

engine = create_engine(DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
