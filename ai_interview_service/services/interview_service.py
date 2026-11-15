import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.interview import Answer, InterviewSession, InterviewStatusEnum


def create_session(db: Session, user_id: int, job_title: str) -> InterviewSession:
    session_id = str(uuid.uuid4())

    interview_session = InterviewSession(
        session_id=session_id,
        user_id=user_id,
        job_title=job_title,
    )

    db.add(interview_session)
    db.flush()  
    return interview_session


def get_session(db: Session, session_id: str, user_id: int) -> InterviewSession | None:
    # filtering by user_id means nobody can open someone else's interview
    return db.scalar(
        select(InterviewSession).where(
            InterviewSession.session_id == session_id,
            InterviewSession.user_id == user_id,
        )
    )


def list_sessions(db: Session, user_id: int) -> list[InterviewSession]:
    return list(
        db.scalars(
            select(InterviewSession)
            .where(InterviewSession.user_id == user_id)
            .order_by(InterviewSession.created_at.desc())
        )
    )


def mark_completed(session: InterviewSession):
    session.status = InterviewStatusEnum.COMPLETED.value
    session.completed_at = datetime.now(timezone.utc)


def save_answer(db: Session, answer: str | None, skip: bool, session: InterviewSession):
    question = session.questions[session.current_index]

    session.answers.append(
        Answer(
            question=question,
            answer=None if skip else answer,
            skip=skip
        )
    )

    session.current_index += 1

    if session.current_index == len(session.questions):
        mark_completed(session)

    db.commit()
