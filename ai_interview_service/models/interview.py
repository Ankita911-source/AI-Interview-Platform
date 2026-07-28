from enum import Enum
from typing import Optional
from pydantic import BaseModel

class InterviewStatusEnum(str, Enum) :
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Answer(BaseModel):
    question: str
    answer: Optional[str]
    skip: bool = False

class InterviewSession(BaseModel):
    session_id: str
    questions: list[str] = []
    status: InterviewStatusEnum = InterviewStatusEnum.IN_PROGRESS
    answers: list[Answer] = []
    current_index: int = 0
