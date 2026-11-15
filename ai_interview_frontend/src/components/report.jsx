import "../assets/css/Report.css";


const Report = ({report, children}) => {
    const score = report?.score ?? "N/A";
    const correct_answer = report?.correct_answer ?? "N/A";
    const feedback = report?.improvment_area || [];

    
    const scoreNumber = parseInt(score, 10);
    const hasScoreBar = Number.isFinite(scoreNumber);

    return <>
        <div className="report-container">
            <h1 className="report-header">Interview Report</h1>
            <div className="report-cards">
                <div className="report-card">
                    <h3>Overall Score</h3>
                    <div className="card-value">{score}</div>
                    {hasScoreBar && (
                        <div className="score-track">
                            <div
                                className="score-fill"
                                style={{ width: `${Math.min(Math.max(scoreNumber, 0), 100)}%` }}
                            ></div>
                        </div>
                    )}
                </div>
                <div className="report-card">
                    <h3>Correct Answer</h3>
                    <div className="card-value">{correct_answer}</div>
                </div>
            </div>
            <div className="feedback-section">
                <h3>Detailed Feedback</h3>
                <ul className="feedback-list">
                    {Array.isArray(feedback) ? (
                        feedback.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))
                    ) : (
                        <li>{JSON.stringify(feedback)}</li>
                    )}
                </ul>
            </div>

            {children && <div className="report-actions">{children}</div>}
        </div>
    </>
}

export default Report;
