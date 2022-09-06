import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import React from "react";


function ProtectedLayout() {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return (
        <>
            <nav>
                <Link to="/settings">Settings</Link>
                <Link to="/profile">Profile</Link>
            </nav>
            <Outlet />
        </>
    )
};

export default ProtectedLayout;