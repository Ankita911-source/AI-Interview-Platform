from pydantic import BaseModel
from typing import Optional

class AnswerResponse(BaseModel):
    interviewEnded: bool
    nextQuestion: Optional[str] = None