from pydantic import BaseModel
from typing import Optional

class AnswerRequest(BaseModel):
    session_id: str
    answer: Optional[str]
    skip: bool