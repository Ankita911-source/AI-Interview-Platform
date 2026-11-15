import "../assets/css/Interview.css"
import speaking from "../assets/Images/speaking.gif";
import listening from "../assets/Images/listening.gif";
import { APP_CONSTANT } from "../utils/constants";

const Interview = ({
    skipQuestion,
    endInterview,
    state,
    question,
    transcript,
    questionNumber,
    totalQuestions,
    busy,
    notice,
}) => {
    const isAsking = state === APP_CONSTANT.ASKING;
    const isListening = state === APP_CONSTANT.LISTENING;
    const progress = totalQuestions ? Math.round((questionNumber / totalQuestions) * 100) : 0;

    let hint = "Listen to the question first...";
    if (busy) {
        hint = "Saving your answer...";
    } else if (isListening) {
        hint = transcript || "Go ahead, we're listening. Pause for 3 seconds when you're done.";
    }

    return <>
    <div className="interview-container">
        {/* Progress */}
        <div className="interview-header">
            <span className="question-count">
                Question {questionNumber}{totalQuestions ? ` of ${totalQuestions}` : ""}
            </span>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        {/* Current question */}
        <div className="question-card">
            <span className="question-label">Interviewer asks</span>
            <p className="question-text">{question}</p>
        </div>

        <div className="interview-stage">
            {/* AI Bot */}
            <div className="bot-section">
                <h2>AI Interviewer</h2>
                {
                    isAsking &&
                    <div className="gif-placeholder">
                        <img src={speaking} alt="Bot Speaking..." />
                    </div>
                }
                {
                    !isAsking &&
                    <div className="gif-placeholder-gray"></div>
                }
                <span className={`status-pill ${isAsking ? "active" : ""}`}>
                    {isAsking ? "Speaking..." : "Waiting"}
                </span>
            </div>

            {/* You */}
            <div className="candidate-section">
                <h2>You</h2>
                {
                    isListening && !busy && <div className="gif-placeholder">
                     <img src={listening} alt="You are Speaking..." />
                </div>
                }
                {
                    (!isListening || busy) && <div className="gif-placeholder-gray">
                </div>
                }
                <span className={`status-pill ${isListening && !busy ? "active" : ""}`}>
                    {busy ? "Processing..." : isListening ? "Listening..." : "Waiting"}
                </span>
            </div>
        </div>

        {/* What we heard so far */}
        <div className="transcript-card">
            <span className="question-label">Your answer</span>
            <p className={transcript && isListening && !busy ? "transcript-text" : "transcript-hint"}>
                {hint}
            </p>
        </div>

        {notice && <p className="error-message">{notice}</p>}

        <div className="controls-section">
            <button onClick={skipQuestion} disabled={busy} className="control-btn skip-btn">Skip Question</button>
            <button onClick={endInterview} disabled={busy} className="control-btn end-btn">End Interview</button>
        </div>
    </div>
    </>
}

export default Interview
