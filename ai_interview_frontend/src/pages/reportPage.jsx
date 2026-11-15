import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Report from "../components/report";
import { reportAPI } from "../services/interviewSer";

// opens the report of an old interview from the history list
const ReportPage = () => {
    const { sessionId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        reportAPI(sessionId).then((data) => {
            if (data) {
                setReport(data.result);
            } else {
                setError("We couldn't find that interview.");
            }
            setLoading(false);
        });
    }, [sessionId]);

    if (loading) {
        return <div className="loader"></div>;
    }

    if (error) {
        return (
            <div className="report-container">
                <p className="error-message">{error}</p>
                <Link to="/history" className="btn btn-outline">Back to history</Link>
            </div>
        );
    }

    return (
        <Report report={report}>
            <Link to="/history" className="btn btn-outline">Back to history</Link>
        </Report>
    );
};

export default ReportPage;
