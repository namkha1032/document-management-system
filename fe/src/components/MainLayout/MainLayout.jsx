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
    const colorTheme = theme.useToken()
    let queryClient = useQueryClient()
    let darklightTheme = queryClient.getQueryData(['theme'])
    return (
        <Layout style={{
            minHeight: '100vh',
        }}
        >
            <SideBar />
            <Layout style={{ background: colorTheme.token.colorBgContainer }}>
                <NavBar />
                <Layout.Content style={{
                    margin: 0,
                    borderRadius: colorTheme.token.borderRadiusLG,
                    padding: "0 16px",
                    backgroundColor: colorTheme.token.colorBgLayout,
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