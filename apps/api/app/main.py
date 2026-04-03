from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.tasks import router as tasks_router
from app.routes.users import router as users_router
from app.db.session import Base, engine
from app.realtime.tasks import manager
import uvicorn

# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trustless Task Bounty API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
app.include_router(users_router, prefix="/users", tags=["users"])

@app.websocket("/ws/tasks")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We just keep connection open, pushing events
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
