import { useState } from "react";
import "../assets/css/StartInterview.css"
import { generateQuestionsAPI, startInterviewAPI } from "../services/interviewSer";


const ALLOWED_FILE = ["application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;


const speechSupported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

const StartInterview = ({onClick}) => {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [resume, setResume] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) => {
        try {
            const file = e.target.files[0];

            if(!file) {
                return;
            }

            if(!ALLOWED_FILE.includes(file.type)) {
                setError("Only PDF allowed");
                e.target.value = "";
                return;
            }

            if(file.size > MAX_FILE_SIZE) {
                setError("File size must be under 5mb.");
                e.target.value = "";
                return;
            }

            setError("");
            setResume(file);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if(!jobTitle || !jobDescription || !resume) {
            setError("All fields are required!!!");
            return;
        }

        setLoading(true);
        setError("");

        try {

            const formData = new FormData();
            formData.append("job_title", jobTitle);
            formData.append("job_description", jobDescription);
            formData.append("resume", resume);

            // generate question endpoint
            const response = await generateQuestionsAPI(formData);

            // Start interview endpoint
            const data = await startInterviewAPI(response.session_id);

            if(!data) {
                setError("Questions are ready but the interview couldn't start. Please try again.");
                return;
            }

            onClick(data, response.session_id);


        } catch (error) {
            console.error("Error: ", error);
            setError(error.message);
        } finally {
             setLoading(false);
        }
    }

    return <>
    <div className="start-interview-container">
        <form className="start-interview-form" onSubmit={handleFormSubmit}>
            <div className="start-header">
                <h1>Start your mock interview</h1>
                <p>Tell us about the role and we'll prepare the questions.</p>
            </div>

            { !speechSupported && (
                <p className="warning-message">
                    Your browser doesn't support speech recognition. Please use Chrome or Edge to answer by voice.
                </p>
            )}

            { error && <p className="error-message">{error}</p> }

            <div className="form-group">
                <label>Job Title</label>
                <input 
                    type="text"
                    placeholder="e.g. Senior Java Developer"
                    required
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                />
            </div>

             <div className="form-group">
                <label>Job Description</label>
                <textarea 
                    placeholder="Paste the job description here"
                    required
                    rows={5}
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Resume (PDF)</label>
                <label className={`file-drop ${resume ? "has-file" : ""}`}>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                    />
                    <span className="file-drop-title">
                        { resume ? resume.name : "Click to choose your resume" }
                    </span>
                    <span className="file-drop-hint">PDF only, up to 5 MB</span>
                </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                { loading && <span className="spinner-inline"></span> }
                { loading ? "Generating questions..." : "Start Interview" }
            </button>

            { loading && <p className="form-note">This can take up to a minute, hang tight.</p> }
            { !loading && <p className="form-note">You'll be asked to allow microphone access.</p> }
        </form>

    </div>
    </>
}

export default StartInterview
