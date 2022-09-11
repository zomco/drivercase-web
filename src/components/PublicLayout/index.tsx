import {useAuth} from "../../hooks/useAuth";
import {Navigate, Outlet, Link} from "react-router-dom";

function PublicLayout() {
    return (
        <>
            <Outlet />
        </>
    )
};

export default PublicLayout;