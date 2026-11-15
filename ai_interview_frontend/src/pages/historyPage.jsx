import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { historyAPI } from "../services/interviewSer";
import "../assets/css/History.css";

const formatDate = (value) =>
    new Date(value).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const HistoryPage = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        historyAPI().then((data) => {
            if (data) {
                setInterviews(data);
            } else {
                setError("Couldn't load your interviews. Please try again.");
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="loader"></div>;
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <div>
                    <h1>Your interviews</h1>
                    <p>Everything you've practised so far.</p>
                </div>
                <Link to="/" className="btn btn-primary">New interview</Link>
            </div>

            {error && <p className="error-message">{error}</p>}

            {!error && interviews.length === 0 && (
                <div className="history-empty">
                    <h3>Nothing here yet</h3>
                    <p>Your finished interviews will show up here with their scores.</p>
                    <Link to="/" className="btn btn-primary">Start your first interview</Link>
                </div>
            )}

            <ul className="history-list">
                {interviews.map((item) => {
                    const completed = item.status === "completed";

                    const content = (
                        <>
                            <div className="history-main">
                                <h3>{item.job_title || "Untitled interview"}</h3>
                                <span className="history-date">{formatDate(item.created_at)}</span>
                            </div>
                            <div className="history-meta">
                                <span>{item.answered}/{item.total_questions} answered</span>
                                {item.score && <span className="score-chip">{item.score}</span>}
                                <span className={`status-badge ${completed ? "done" : "pending"}`}>
                                    {completed ? "Completed" : "Unfinished"}
                                </span>
                            </div>
                        </>
                    );

                    return (
                        <li key={item.session_id}>
                            {completed ? (
                                <Link to={`/history/${item.session_id}`} className="history-item">
                                    {content}
                                </Link>
                            ) : (
                                <div className="history-item disabled">{content}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default HistoryPage;
