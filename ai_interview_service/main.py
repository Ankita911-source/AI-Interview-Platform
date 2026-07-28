from fastapi import FastAPI
from routers.interview import router as interview_router

app = FastAPI(
    version= "0.0.1",
    title= "AI Interview Platform Service",
    description= "AI Interview Platform using FastAPI"
)

app.include_router(interview_router)