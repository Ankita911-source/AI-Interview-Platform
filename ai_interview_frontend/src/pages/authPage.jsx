import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/Auth.css";


const AuthPage = ({ mode }) => {
    const isSignup = mode === "signup";
    const { login, signup } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (isSignup && password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            if (isSignup) {
                await signup(name.trim(), email.trim(), password);
            } else {
                await login(email.trim(), password);
            }
            
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-hero">
                <div className="auth-hero-inner">
                    <div className="brand-mark brand-mark-lg">AI</div>
                    <h1>Practice interviews that talk back.</h1>
                    <p>
                        Upload your resume, paste the job description and get a real,
                        spoken mock interview with feedback at the end.
                    </p>
                    <ul>
                        <li>Questions tailored to your resume and the role</li>
                        <li>Answer out loud, we submit when you pause</li>
                        <li>Every interview is saved so you can track progress</li>
                    </ul>
                </div>
            </section>

            <section className="auth-panel">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>{isSignup ? "Create your account" : "Welcome back"}</h2>
                    <p className="auth-subtitle">
                        {isSignup
                            ? "It only takes a minute."
                            : "Log in to continue your interview practice."}
                    </p>

                    {error && <p className="error-message">{error}</p>}

                    {isSignup && (
                        <div className="form-group">
                            <label htmlFor="name">Full name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                required
                                minLength={2}
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder={isSignup ? "At least 8 characters" : "Your password"}
                            required
                            autoComplete={isSignup ? "new-password" : "current-password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading && <span className="spinner-inline"></span>}
                        {isSignup ? "Sign up" : "Log in"}
                    </button>

                    <p className="auth-switch">
                        {isSignup ? "Already have an account?" : "New here?"}{" "}
                        <Link to={isSignup ? "/login" : "/signup"}>
                            {isSignup ? "Log in" : "Create an account"}
                        </Link>
                    </p>
                </form>
            </section>
        </div>
    );
};

export default AuthPage;
