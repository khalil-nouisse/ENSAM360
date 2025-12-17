import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

const ProtectedRoute = () => {
    // We check if we have a token in localStorage as a quick check
    // Ideally useAuth() would provide an 'auth' object that is populated
    // But since context is lost on refresh (unless persisted), we check localStorage too
    const token = localStorage.getItem('token');

    // If no token, redirect to auth (login) page
    return token ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default ProtectedRoute;
