import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    Html5TwoTone,
    CloudTwoTone,
    CompassTwoTone,
    Html5Outlined,
    HddOutlined,
    Html5Filled,
    RightOutlined,
    SlidersOutlined,
    SearchOutlined,
    UserOutlined,
    TeamOutlined,
    DeleteOutlined,
    BarsOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Typography,
    Switch,
    Input,
    Flex,
    Button,
    Collapse,
    Row,
    Col,
    Avatar,
    Segmented,
    Card
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useSearchParams, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import FolderTree from '../FolderTree/FolderTree';
// //////////////////////////////////////////////////////
const { Text, Title, Paragraph } = Typography
const { Header, Content, Footer, Sider } = Layout;


const SideBar = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openFolderTree, setOpenFolderTree] = useState([])
    let queryClient = useQueryClient()
    let modeTheme = queryClient.getQueryData(['modeTheme'])
    const antdTheme = theme.useToken()
    const location = useLocation()
    const navigate = useNavigate()
    const sidebarItemQuery = useQuery(
        {
            queryKey: ["sidebarItem"],
            queryFn: () => {
                console.log("sidebar run")
                if (location.pathname.includes("company")) {
                    return '1'
                }
                else if (location.pathname.includes("my-documents")) {
                    return '2'
                }
                else if (location.pathname.includes("shared-documents")) {
                    return '3'
                }
                else if (location.pathname.includes("trash")) {
                    return '4'
                }
                else {
                    return '0'
                }
            }
        }
    )
    const items = [
        {
            key: '1',
            icon: <HddOutlined />,
            label: "Company"
        },
        {
            key: '2',
            icon: <UserOutlined />,
            label: "My documents"
        },
        {
            key: '3',
            icon: <TeamOutlined />,
            label: "Shared with me"
        },
        {
            key: '4',
            icon: <DeleteOutlined />,
            label: "Trash"
        }
    ]
    return (
        <Sider
            style={{
                // background: queryClient.getQueryData(['modeTheme']) == "light" ? antdTheme.token.colorBgBase : "#001529" 
                background: antdTheme.token.colorBgContainer
            }}
            width="13%"
            collapsible collapsed={collapsed}
            trigger={
                <Flex
                    justify="center" align="center"
                    style={{ width: "100%", height: "100%", backgroundColor: antdTheme.token.colorBgContainer }}>
                    <Button
                        style={{ width: "100%", margin: antdTheme.token.marginXXS, backgroundColor: antdTheme.token.colorPrimaryBg, transition: "backgroundColor 0.215s" }}
                        type={modeTheme == "dark" ? "primary" : "default"}
                        // type={"primary"}
                        ghost={modeTheme == "dark" ? true : false}
                        onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                </Flex>
            }
            onCollapse={(value) => setCollapsed(value)}>
            <div style={{
                display: "flex",
                // justifyContent: collapsed ? "center" : "flex-start",
                justifyContent: "flex-start",
                alignItems: "center",
                columnGap: 15,
                height: 60,
                // margin: `0 ${antdTheme.token.marginXXS}px`,
                padding: collapsed ? `0 ${40 - antdTheme.token.fontSizeHeading3 / 2}px` : `0 ${35 - antdTheme.token.fontSizeHeading3 / 2}px`,
                transition: "padding 0.215s"
            }}>
                <Html5Outlined
                    style={{ fontSize: antdTheme.token.fontSizeHeading3, color: antdTheme.token.colorTextBase }}
                />
                <Text strong={true} style={{
                    fontSize: antdTheme.token.fontSizeHeading3, whiteSpace: "nowrap",
                    display: collapsed ? "none" : "block"
                }}>
                    xCorp
                </Text>
            </div>
            <Menu theme={modeTheme}
                style={{ border: 0 }}
                selectedKeys={[queryClient.getQueryData(['sidebarItem'])]}
                mode="inline" items={items}
                onSelect={(event) => {
                    if (event.key == '1') {
                        queryClient.setQueryData(['sidebarItem'], '1')
                        navigate("/company")
                    }
                    else if (event.key == '2') {
                        queryClient.setQueryData(['sidebarItem'], '2')
                        navigate("/my-documents")
                    }
                    else if (event.key == '3') {
                        queryClient.setQueryData(['sidebarItem'], '3')
                        navigate("/shared-documents")
                    }
                    else if (event.key == '4') {
                        queryClient.setQueryData(['sidebarItem'], '4')
                        navigate("/trash")
                    }
                }}
            />
        </Sider>
    )
}

export default SideBar