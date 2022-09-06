import {useAuth} from "../../hooks/useAuth";
import {Navigate, Outlet, Link} from "react-router-dom";
import {Layout} from "antd";

const { Header, Footer, Content } = Layout;

function PublicLayout() {
    const { user } = useAuth();
    if (user) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    return (
        <>
            {/*<Header>Header</Header>*/}
            {/*<Content><Outlet /></Content>*/}
            {/*<Footer>Footer</Footer>*/}
            <Outlet />
        </>
    )
};

export default PublicLayout;