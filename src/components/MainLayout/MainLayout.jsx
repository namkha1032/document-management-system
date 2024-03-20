import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {
    Layout,
    theme
} from 'antd';
import SideBar from '../SideBar/SideBar';
import NavBar from "../NavBar/NavBar"
import Footer from '../Footer/Footer';
import Bread from '../Bread/Bread';
import UserContext from '../../context/UserContext';
// //////////////////////////////////////////////////////

const MainLayout = () => {
    let [user, dispatchUser] = useContext(UserContext)
    let userStorage = localStorage.getItem("user")
    // hooks
    const antdTheme = theme.useToken()
    return (
        userStorage
            ? <Layout style={{
                minHeight: '100vh',
            }}
            >
                <SideBar />
                <Layout style={{ background: antdTheme.token.colorBgContainer }}>
                    <NavBar />
                    <Layout.Content style={{
                        margin: 0,
                        borderRadius: antdTheme.token.borderRadiusLG,
                        padding: "16px",
                        backgroundColor: antdTheme.token.colorBgLayout,
                        overflowY: "scroll"
                    }}
                    >
                        <Outlet />
                    </Layout.Content>
                    {/* <Footer /> */}
                </Layout>
            </Layout >
            : <Navigate to="/login" replace={true} />
    );
};
export default MainLayout;