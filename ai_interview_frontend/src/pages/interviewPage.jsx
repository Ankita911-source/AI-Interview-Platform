import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_CONSTANT } from "../utils/constants";
import { playAudio } from "../utils/audio";
import StartInterview from "../components/StartInterview";
import { submitAPI, reportAPI, endInterviewAPI } from "../services/interviewSer";
import Interview from "../components/interview";
import { useSpeechToText } from "../hooks/useSpeechToText";
import Report from "../components/report";

const InterviewPage = () => {
    const [sessionId, setSessionId] = useState(null);
    const [status, setStatus] = useState(APP_CONSTANT.IDLE);
    const [question, setQuestion] = useState("");
    const [questionNumber, setQuestionNumber] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState("");

    
    const onAutoSubmit = async (finalText) => {
        await sendAnswer({
            session_id: sessionId,
            answer: finalText,
            skip: false,
        });
    };

    const { transcript, startListening, stopListening } = useSpeechToText(onAutoSubmit);

    const sendAnswer = async (payload) => {
        setSubmitting(true);
        setNotice("");

        const data = await submitAPI(payload);
        setSubmitting(false);

        if (!data) {
            console.error("submitAPI failed");
            // don't leave the person staring at a dead screen, let them answer again
            setNotice("We couldn't save that answer. Please say it again.");
            startListening();
            return;
        }

        if (data.interviewEnded) {
            finshInterview();
        } else {
            setQuestion(data.nextQuestion);
            setQuestionNumber((n) => n + 1);
            setStatus(APP_CONSTANT.ASKING);
        }
    };

    const finshInterview = async () => {
        setLoading(true);
        setStatus(APP_CONSTANT.COMPLETED);
        const data = await reportAPI(sessionId);

        if (!data) {
            setLoading(false);
            return;
        }

        setReport(data.result);
        setLoading(false);
    };

    const endInterview = async () => {
        stopListening();

        const data = await endInterviewAPI(sessionId);

        if (!data) {
            console.error("endInterviewAPI failed");
            return;
        }

        await finshInterview();
    };

    const skipQuestion = async () => {
        stopListening();

        await sendAnswer({
            session_id: sessionId,
            answer: "",
            skip: true,
        });
    };

    useEffect(() => {
        if (status !== APP_CONSTANT.ASKING) return;


        let cancelled = false;

        playAudio(question, () => {
            if (cancelled) return;
            setStatus(APP_CONSTANT.LISTENING);
            startListening();
        });

        return () => {
            cancelled = true;
            window.speechSynthesis?.cancel();
        };
    }, [status, question]);

    useEffect(() => () => window.speechSynthesis?.cancel(), []);

    const startInterview = async (data, session_id) => {
        setLoading(true);

        setSessionId(session_id);
        setQuestion(data.firstQuestion);
        setQuestionNumber(1);
        setTotalQuestions(data.totalQuestions || 0);

        setStatus(APP_CONSTANT.INTRO)

        // play Text to speeach
        const introText = data.introText;
        playAudio(introText, () => {
            setLoading(false);
            setStatus(APP_CONSTANT.ASKING)
        });
    }

    const startAgain = () => {
        setSessionId(null);
        setQuestion("");
        setReport(null);
        setNotice("");
        setStatus(APP_CONSTANT.IDLE);
    }

    return <>

        {loading && <div className="loader"></div>}

        { status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview}/> }

        { (status === APP_CONSTANT.ASKING || status === APP_CONSTANT.LISTENING) &&
            <Interview
                skipQuestion={skipQuestion}
                endInterview={endInterview}
                state={status}
                question={question}
                transcript={transcript}
                questionNumber={questionNumber}
                totalQuestions={totalQuestions}
                busy={submitting}
                notice={notice}
            />
        }

        { status === APP_CONSTANT.COMPLETED && !loading &&
            <Report report={report}>
                <button className="btn btn-primary" onClick={startAgain}>Start another interview</button>
                <Link to="/history" className="btn btn-outline">View history</Link>
            </Report>
        }
    </>
}

export default InterviewPage;
