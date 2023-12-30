import { Layout, Space, Flex, Typography } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography
const headerStyle = {
    textAlign: 'center',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    color: '#fff',
    backgroundColor: '#7dbcea',
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    // color: '#fff',
    // backgroundColor: '#108ee9',
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9',
};
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
};

const AdminLayout = () => {
    return (
        <>
            <Flex
                vertical
                style={{
                    width: '100%',
                }}
                gap={"small"}
            >
                <Layout>
                    <Header style={headerStyle}>Header</Header>
                    <Content style={contentStyle}><Text>Content</Text></Content>
                    <Footer style={footerStyle}>Footer</Footer>
                </Layout>
                <Layout>
                    <Header style={headerStyle}>Header</Header>
                    <Layout hasSider>
                        <Sider style={siderStyle}>Sider</Sider>
                        <Content style={contentStyle}><Text>Content</Text></Content>
                    </Layout>
                    <Footer style={footerStyle}>Footer</Footer>
                </Layout>
                <Layout>
                    <Header style={headerStyle}>Header</Header>
                    <Layout hasSider>
                        <Content style={contentStyle}><Text>Content</Text></Content>
                        <Sider style={siderStyle}>Sider</Sider>
                    </Layout>
                    <Footer style={footerStyle}>Footer</Footer>
                </Layout>
                <Layout>
                    <Sider style={siderStyle}>Sider</Sider>
                    <Layout>
                        <Header style={headerStyle}>Header</Header>
                        <Content style={contentStyle}><Text>Content</Text></Content>
                        <Footer style={footerStyle}>Footer</Footer>
                    </Layout>
                </Layout>
                <Layout hasSider>
                    <Sider style={siderStyle}>Sider</Sider>
                    <Layout>
                        <Header style={headerStyle}>Header</Header>
                        <Content style={contentStyle}><Text>Content</Text></Content>
                        <Footer style={footerStyle}>Footer</Footer>
                    </Layout>
                </Layout>
            </Flex>
        </>
    )
}

export default AdminLayout