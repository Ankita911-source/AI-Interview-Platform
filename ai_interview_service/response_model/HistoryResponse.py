from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class InterviewSummary(BaseModel):
    session_id: str
    job_title: str
    status: str
    created_at: datetime
    total_questions: int
    answered: int
    score: Optional[str] = None