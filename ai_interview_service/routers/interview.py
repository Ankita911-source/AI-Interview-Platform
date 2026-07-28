from fastapi import APIRouter, HTTPException, status
from services.interview_service import create_session
from request_model.AnswerRequest import AnswerRequest
from services.interview_service import get_session, save_answer
from models.interview import InterviewStatusEnum
from response_model.AnswerResponse import AnswerResponse


router = APIRouter(
    prefix= "/interview",
    tags=["Interview"]
)

@router.get("/start")
async def start_interview():
    questions = [
        "add 1 and 2 and what is tha value?",
        "What is javascript?",
        "What is Inheritance"
    ]

    session = create_session()

    session.questions = questions

    return {
        "introText": "Hey candidate!! Welcome to AI Interview Platform",
        "session_id": session.session_id,
        "firstQuestion": session.questions[0]
    }

@router.post("/submit", response_model=AnswerResponse)
async def submit_answer(answerReq: AnswerRequest):

    #Check valid session_id 
    session = get_session(answerReq.session_id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "Interview Session Not Found")

    #Save answer in interview session
    save_answer(answerReq.answer, answerReq.skip, session)

    #return
    if session.status == InterviewStatusEnum.COMPLETED:
        return{
            "interviewEnded" : True
        }

    return {
        "interviewEnded": False,
        "nextQuestion": session.questions[session.current_index]
    }

@router.put("/end/{session_id}")
async def end_interview(session_id: str):
    #Check valid session_id 
    session = get_session(session_id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "Interview Session Not Found")

    session.status = InterviewStatusEnum.COMPLETED

    return {
        "interviewEnded" : True
    }

@router.get("/report/{session_id}")
async def report(session_id: str):
    #Check valid session_id 
    session = get_session(session_id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "Interview Session Not Found")

    return {
        "result" : "Your Interview Report"
    }


