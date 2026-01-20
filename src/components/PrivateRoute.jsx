import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in but role hasn't loaded yet, wait.
    // This prevents the race condition where AuthContext is still fetching the role.
    if (currentUser && userRole === null) {
        return <div style={{ padding: "2rem", textAlign: "center" }}>Fetching User Profile...</div>;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to home if logged in but unauthorized, 
        // or maybe to their specific dashboard if we want to be smarter.
        // For now, simple redirect.
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
