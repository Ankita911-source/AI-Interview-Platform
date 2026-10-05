from fastapi import FastAPI
from routers.interview import router as interview_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    version= "0.0.1",
    title= "AI Interview Platform Service",
    description= "AI Interview Platform using FastAPI"
)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview_router)