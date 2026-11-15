import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-mark">AI</span>
                <span className="brand-text">Interview</span>
            </Link>

            <nav className="navbar-links">
                <NavLink to="/" end>New Interview</NavLink>
                <NavLink to="/history">History</NavLink>
            </nav>

            <div className="navbar-user">
                <span className="navbar-name">{user?.name}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </header>
    );
};

export default Navbar;