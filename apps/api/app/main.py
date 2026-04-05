from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.tasks import router as tasks_router
from app.routes.users import router as users_router
from app.db.session import Base, engine
from app.realtime.tasks import manager
import uvicorn

app = FastAPI(title="Trustless Task Bounty API")

# We list EVERY combination including the ones we saw in your logs
CORS_ORIGINS = [
    "http://localhost:3000",
    "https://algo-bounty.vercel.app",
    "https://algo-bounty-onmdstank-yaseen-711s-projects.vercel.app",
    "https://algo-bounty-git-main-yaseen-711s-projects.vercel.app",
    "https://algo-bounty-yaseen-711s-projects.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://algo-bounty.*\.vercel\.app",
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Only try to create tables after app is up, so we don't block the port check
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Startup DB Error: {e}")

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
