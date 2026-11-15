# from enum import Enum
from datetime import datetime
from enum import StrEnum
from typing import Optional

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from models.user import User


class InterviewStatusEnum(StrEnum):  # (StrEnum) = (str, Enum)
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class InterviewSession(Base):
    __tablename__ = "interview_sessions"


    session_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    job_title: Mapped[str] = mapped_column(String(200), default="")
    intro_text: Mapped[str] = mapped_column(Text, default="")
    questions: Mapped[list] = mapped_column(JSON, default=list)
    current_index: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(
        String(20), default=InterviewStatusEnum.IN_PROGRESS.value
    )

    report: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    user: Mapped[User] = relationship(back_populates="interviews")
    answers: Mapped[list["Answer"]] = relationship(
        back_populates="session", cascade="all, delete-orphan", order_by="Answer.id"
    )


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(
        ForeignKey("interview_sessions.session_id", ondelete="CASCADE"), index=True
    )
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    skip: Mapped[bool] = mapped_column(Boolean, default=False)

    session: Mapped[InterviewSession] = relationship(back_populates="answers")


