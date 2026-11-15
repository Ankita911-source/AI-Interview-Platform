import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loader"></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};


export const PublicOnlyRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loader"></div>;
    }

    if (user) {
        return <Navigate to={location.state?.from?.pathname || "/"} replace />;
    }

    return <Outlet />;
};
