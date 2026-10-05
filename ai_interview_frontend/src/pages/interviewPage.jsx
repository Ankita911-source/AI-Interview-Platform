// import StartInterview from "../components/StartInterview";
// import { submitAPI, reportAPI, endInterviewAPI } from "../services/interview";
// import { playAudio } from "../util/audio";
// import Interview from "../components/Interview";
// import { useSpeechToText } from "../hooks/useSpeechToText";
// import Report from "../components/Report";

// import { useEffect, useState } from "react";
// import { APP_CONSTANT } from "../utils/constants";
// import {playAudio} from "../utils/audio"
// import StartInterview from "../components/StartInterview";
// import { submitAPI, reportAPI, endInterviewAPI } from "../services/interviewSer";
// import Interview from "../components/interview";
// import { useSpeechToText } from "../hooks/useSpeechToText";
// import Report from "../components/report";
// import "../assets/css/InterviewPage.css";

// const InterviewPage = () => {

//     const [sessionId, setSessionId] = useState(null);
//     const [status, setStatus] = useState(APP_CONSTANT.IDLE);
//     const [question, setQuestion] = useState("");
//     const [report, setReport] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const onAutoSubmit = async (finalText) => {
//         stopListening();

//         if(!finalText.trim()) {
//             return;
//         }

//         // submit endpoint
//         const payload = {
//             "session_id": sessionId,
//             "answer": finalText,
//             "skip": false
//         }
//         const data = await submitAPI(payload);

//         if(data.interviewEnded) {
//             // Report generate
//             finshInterview();
//         } else {
//             // Ask next question
//             setQuestion(data.nextQuestion);
//             setStatus(APP_CONSTANT.ASKING);
//         }
//     }

//     const { startListening, stopListening } = useSpeechToText(onAutoSubmit);

//     const finshInterview = async () => {
//         setLoading(true);
//         setStatus(APP_CONSTANT.COMPLETED);
//         // call report endpoint
//         const data = await reportAPI(sessionId);

//         if(!data) {
//             return;
//         }

//         setReport(data.result)
//         setLoading(false);

//     }

//     const endInterview = async () => {
//         // TODO endInterview
//         stopListening();

//         // call end endpoint
//         await endInterviewAPI(sessionId);
//         await finshInterview();
//     }

//     const skipQuestion = async () => {
//         // TODO skipQuestion
//         stopListening();

//         // submit endpoint
//         const payload = {
//             "session_id": sessionId,
//             "answer": "",
//             "skip": true
//         }
//         const data = await submitAPI(payload);

//         if(data.interviewEnded) {
//             // Report generate
//             finshInterview();
//         } else {
//             // Ask next question
//             setQuestion(data.nextQuestion);
//             setStatus(APP_CONSTANT.ASKING);
//         }
//     }

//     useEffect(() => {
//         if(status === APP_CONSTANT.ASKING) {
//             playAudio(question, () => {
//                 setStatus(APP_CONSTANT.LISTENING);

//                 startListening();
//             })
//         }
//     }, [status, question]);

//     const startInterview = async (data, session_id) => {
//         setLoading(true);

//         // response sessionId, status, question
//         setSessionId(session_id);
//         setQuestion(data.firstQuestion);

//         setStatus(APP_CONSTANT.INTRO)

//         // play Text to speeach
//         const introText = data.introText;
//         playAudio(introText, () => {
//             setLoading(false);
//             setStatus(APP_CONSTANT.ASKING)
//         });
//     }

//     return <>

//         {loading && <div class="loader"></div>}

//         { status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview}/> }

//         { (status === APP_CONSTANT.ASKING || status === APP_CONSTANT.LISTENING) && <Interview skipQuestion={skipQuestion} endInterview={endInterview} state={status}/> } 

//         { status === APP_CONSTANT.COMPLETED && <Report report={report}/> }
//     </>
// }

// export default InterviewPage;


import { useEffect, useState } from "react";
import { APP_CONSTANT } from "../utils/constants";
import {playAudio} from "../utils/audio"
import StartInterview from "../components/StartInterview";
import { submitAPI, reportAPI, endInterviewAPI } from "../services/interviewSer";
import Interview from "../components/interview";
import { useSpeechToText } from "../hooks/useSpeechToText";
import Report from "../components/report";
import "../assets/css/InterviewPage.css";

const InterviewPage = () => {

    const [sessionId, setSessionId] = useState(null);
    const [status, setStatus] = useState(APP_CONSTANT.IDLE);
    const [question, setQuestion] = useState("");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const onAutoSubmit = async (finalText) => {
        stopListening();

        if(!finalText.trim()) {
            return;
        }

        // submit endpoint
        const payload = {
            "session_id": sessionId,
            "answer": finalText,
            "skip": false
        }
        const data = await submitAPI(payload);

        if (!data) {                              // ✅ null check #1
            console.error("submitAPI failed (onAutoSubmit)");
            return;
        }

        if(data.interviewEnded) {
            // Report generate
            finshInterview();
        } else {
            // Ask next question
            setQuestion(data.nextQuestion);
            setStatus(APP_CONSTANT.ASKING);
        }
    }

    const { startListening, stopListening } = useSpeechToText(onAutoSubmit);

    const finshInterview = async () => {
        setLoading(true);
        setStatus(APP_CONSTANT.COMPLETED);
        // call report endpoint
        const data = await reportAPI(sessionId);

        if(!data) {                                // ✅ already tha (null check #2)
            setLoading(false);                     // (loading false karna bhi zaroori hai yahan)
            return;
        }

        setReport(data.result)
        setLoading(false);

    }

    const endInterview = async () => {
        // TODO endInterview
        stopListening();

        // call end endpoint
        const data = await endInterviewAPI(sessionId);

        if (!data) {                               // ✅ null check #3
            console.error("endInterviewAPI failed");
            return;
        }

        await finshInterview();
    }

    const skipQuestion = async () => {
        // TODO skipQuestion
        stopListening();

        // submit endpoint
        const payload = {
            "session_id": sessionId,
            "answer": "",
            "skip": true
        }
        const data = await submitAPI(payload);

        if (!data) {                               // ✅ null check #4
            console.error("submitAPI failed (skipQuestion)");
            return;
        }

        if(data.interviewEnded) {
            // Report generate
            finshInterview();
        } else {
            // Ask next question
            setQuestion(data.nextQuestion);
            setStatus(APP_CONSTANT.ASKING);
        }
    }

    useEffect(() => {
        if(status === APP_CONSTANT.ASKING) {
            playAudio(question, () => {
                setStatus(APP_CONSTANT.LISTENING);

                startListening();
            })
        }
    }, [status, question]);

    const startInterview = async (data, session_id) => {
        setLoading(true);

        // response sessionId, status, question
        setSessionId(session_id);
        setQuestion(data.firstQuestion);

        setStatus(APP_CONSTANT.INTRO)

        // play Text to speeach
        const introText = data.introText;
        playAudio(introText, () => {
            setLoading(false);
            setStatus(APP_CONSTANT.ASKING)
        });
    }

    return <>

        {loading && <div className="loader"></div>}

        { status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview}/> }

        { (status === APP_CONSTANT.ASKING || status === APP_CONSTANT.LISTENING) && <Interview skipQuestion={skipQuestion} endInterview={endInterview} state={status}/> } 

        { status === APP_CONSTANT.COMPLETED && <Report report={report}/> }
    </>
}

export default InterviewPage;