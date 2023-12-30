import { Outlet } from 'react-router-dom';
import {
    Layout,
    theme
} from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import SideBar from '../SideBar/SideBar';
import NavBar from "../NavBar/NavBar"
import Footer from '../Footer/Footer';
import Bread from '../Bread/Bread';
// //////////////////////////////////////////////////////

const MainLayout = () => {
    const myTheme = theme.useToken()
    let queryClient = useQueryClient()
    let dmsTheme = queryClient.getQueryData(['theme'])
    return (
        <Layout style={{
            minHeight: '100vh',
        }}
        >
            <SideBar />
            <Layout style={{ background: myTheme.token.colorBgContainer }}>
                <NavBar />
                <Layout.Content style={{
                    margin: 0,
                    borderRadius: myTheme.token.borderRadiusLG,
                    padding: "0 16px",
                    backgroundColor: myTheme.token.colorBgLayout,
                    overflowY: "scroll"
                }}
                >
                    <Bread />
                    <Outlet />
                </Layout.Content>
                <Footer />
            </Layout>
        </Layout >
    );
};
export default MainLayout;