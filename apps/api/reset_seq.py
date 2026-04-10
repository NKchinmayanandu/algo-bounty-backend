import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"), connect_args={"sslmode": "require", "connect_timeout": 10})

with engine.connect() as conn:
    # Fix task 103: it's CLAIMED on-chain but FUNDED in DB
    conn.execute(text("UPDATE tasks SET status = 'CLAIMED' WHERE id = 103;"))
    
    # Bump sequence to 201 so new tasks won't collide with any existing on-chain boxes
    conn.execute(text("ALTER SEQUENCE tasks_id_seq RESTART WITH 201;"))
    
    conn.commit()
    print("Fixed: task 103 status synced to CLAIMED")
    print("Fixed: new tasks will start from ID 201")
