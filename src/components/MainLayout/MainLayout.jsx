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
    const antdTheme = theme.useToken()
    let queryClient = useQueryClient()
    let modeTheme = queryClient.getQueryData(['modeTheme'])
    return (
        <Layout style={{
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
                    {/* <Bread /> */}
                    <Outlet />
                </Layout.Content>
                <Footer />
            </Layout>
        </Layout >
    );
};
export default MainLayout;