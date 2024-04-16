import { useContext, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import {
    Layout,
    theme,
    Skeleton
} from 'antd';
import SideBar from '../SideBar/SideBar';
import NavBar from "../NavBar/NavBar"
import Footer from '../Footer/Footer';
import Bread from '../Bread/Bread';
import UserContext from '../../context/UserContext';
import { getMe } from '../../apis/userApi';
// //////////////////////////////////////////////////////

const MainLayout = () => {
    // hooks
    let [user, dispatchUser] = useContext(UserContext)
    let navigate = useNavigate()
    useEffect(() => {
        async function fetchData() {
            let userStorage = localStorage.getItem("user")
            if (!userStorage) {
                navigate("/login")
            }
            else {
                // console.log*
                let response = await getMe(JSON.parse(userStorage).access_token)
                if (!response) {
                    navigate("/login")
                }
                else {
                    dispatchUser({ type: "login", payload: JSON.parse(userStorage) })
                }
            }
        }
        fetchData()
    }, [])
    const antdTheme = theme.useToken()
    // let primaryBgColor = antdTheme.token.colorBgLayout
    // let secondaryBgColor = antdTheme.token.colorBgElevated
    let primaryBgColor = antdTheme.token.colorBgElevated
    let secondaryBgColor = antdTheme.token.colorBgLayout
    return (
        user
            ? <Layout style={{
                minHeight: '100vh',
            }}
            >
                <SideBar />
                <Layout style={{ background: secondaryBgColor }}>
                    <NavBar />
                    <Layout.Content style={{
                        margin: 0,
                        borderRadius: antdTheme.token.borderRadiusLG,
                        padding: "16px",
                        // backgroundColor: antdTheme.token.colorBgLayout,
                        backgroundColor: primaryBgColor,
                        overflowY: "scroll"
                    }}
                    >
                        <Outlet />
                    </Layout.Content>
                    {/* <Footer /> */}
                </Layout>
            </Layout >
            : <Skeleton />
    );
};
export default MainLayout;