# from enum import Enum
from enum import StrEnum
from typing import Optional
from pydantic import BaseModel

class InterviewStatusEnum(StrEnum):  #(strEnum) = (str, Enum)
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
    introText: str = ""
