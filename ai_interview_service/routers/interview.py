from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from database import get_db
from models.interview import InterviewStatusEnum
from models.user import User
from request_model.AnswerRequest import AnswerRequest
from response_model.AnswerResponse import AnswerResponse
from response_model.HistoryResponse import InterviewSummary
from services.ai_service import generate_questions_intro, generate_report
from services.interview_service import (
    create_session,
    get_session,
    list_sessions,
    mark_completed,
    save_answer,
)
from utils.auth_dependency import get_current_user
from utils.file_util import extract_text, validate_file

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)

NOT_FOUND = "Interview Session Not Found"


@router.post("/generate-question")
async def generate_questions(
    job_title: str = Form(...),
    job_description: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate resume file
    await validate_file(resume)

    # Extract text from resume
    resume_text = await extract_text(resume)

    # Generate questions and intro text using title, decription, resume content
    resp = await generate_questions_intro(job_title=job_title, job_description=job_description, resume_text=resume_text)

    questions = resp.get("questions")
    if not questions:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Could not generate questions, please try again.")

    session = create_session(db, current_user.id, job_title.strip())
    session.questions = questions
    session.intro_text = resp.get("introText", "")
    db.commit()

    return { "session_id": session.session_id }


@router.get("/history", response_model=list[InterviewSummary])
def history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sessions = list_sessions(db, current_user.id)

    return [
        {
            "session_id": s.session_id,
            "job_title": s.job_title,
            "status": s.status,
            "created_at": s.created_at,
            "total_questions": len(s.questions or []),
            "answered": sum(1 for a in s.answers if not a.skip),
            "score": (s.report or {}).get("score"),
        }
        for s in sessions
    ]


@router.get("/start/{session_id}")
async def start_interview(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check valid session_id
    session = get_session(db, session_id, current_user.id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND)

    return {
        "introText": session.intro_text,
        "firstQuestion": session.questions[0],
        "totalQuestions": len(session.questions)
    }


@router.post("/submit", response_model=AnswerResponse)
async def submit_answer(
    answerReq: AnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check valid session_id
    session = get_session(db, answerReq.session_id, current_user.id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND)


    # save answer in interview session
    save_answer(db, answerReq.answer, answerReq.skip, session)

    # return
    if session.status == InterviewStatusEnum.COMPLETED:
        return {
            "interviewEnded": True
        }
    
    return {
        "interviewEnded": False,
        "nextQuestion": session.questions[session.current_index]
    }

@router.put("/end/{session_id}")
async def end_interview(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check valid session_id
    session = get_session(db, session_id, current_user.id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND)
    
    mark_completed(session)
    db.commit()

    return {
            "interviewEnded": True
    }

@router.get("/report/{session_id}")
async def report(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check valid session_id
    session = get_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND)

    # if already generated
    if session.report:
        return { "result": session.report }

    answers = [
        {"question": a.question, "answer": a.answer, "skip": a.skip}
        for a in session.answers
    ]
    resp = await generate_report(answers)

    if session.status == InterviewStatusEnum.COMPLETED:
        session.report = resp
        db.commit()

    return { "result":  resp }
