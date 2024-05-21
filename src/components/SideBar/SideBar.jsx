import { useEffect, useState, useContext } from 'react';
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
    BarsOutlined,
    ShareAltOutlined
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
import FolderTree from '../FolderTree/FolderTree';
// import context
import ModeThemeContext from '../../context/ModeThemeContext';
// //////////////////////////////////////////////////////
const { Text, Title, Paragraph } = Typography
const { Header, Content, Footer, Sider } = Layout;


const SideBar = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openFolderTree, setOpenFolderTree] = useState([])
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    const antdTheme = theme.useToken()
    const location = useLocation()
    const navigate = useNavigate()
    let [sidebarItem, setSidebarItem] = useState("0")
    let userStorage = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        // if (location) {
        if (location.pathname.includes("company")) {
            setSidebarItem('1')
        }
        else if (location.pathname.includes("my-documents")) {
            setSidebarItem('2')
        }
        else if (location.pathname.includes("shared-documents")) {
            setSidebarItem('3')
        }
        else if (location.pathname.includes("search")) {
            setSidebarItem('4')
        }
        else if (location.pathname.includes("trash")) {
            setSidebarItem('5')
        }
        else if (location.pathname.includes("ontologyold")) {
            setSidebarItem('7')
        }
        else if (location.pathname.includes("ontology")) {
            setSidebarItem('6')
        }
        // }
    }, [location])
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
            icon: <SearchOutlined />,
            label: "Search"
        },
        {
            key: '5',
            icon: <DeleteOutlined />,
            label: "Trash"
        },
        {
            key: '6',
            icon: <ShareAltOutlined />,
            label: "Ontology"
        }
    ]
    let primaryBgColor = antdTheme.token.colorBgElevated
    let secondaryBgColor = antdTheme.token.colorBgLayout
    // let primaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgElevated : antdTheme.token.colorBgLayout
    // let secondaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgLayout : antdTheme.token.colorBgElevated
    return (
        <Sider
            style={{
                background: secondaryBgColor
            }}
            width="13%"
            collapsible collapsed={collapsed}
            trigger={
                <Flex
                    justify="center" align="center"
                    style={{ width: "100%", height: "100%", backgroundColor: secondaryBgColor }}>
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
                    DMS
                </Text>
            </div>
            <Menu theme={modeTheme}
                style={{
                    border: 0,
                    background: secondaryBgColor,
                    padding: "0 8px"
                }}
                selectedKeys={[sidebarItem]}
                mode="inline"
                items={items.filter((ite, idx) => {
                    if (userStorage?.is_expertuser && ite.key == '6') {
                        return true
                    }
                    else if (!userStorage?.is_expertuser && ite.key !== '6') {
                        return true
                    }
                    else {
                        return false
                    }
                })}
                onSelect={(event) => {
                    if (event.key == '1') {
                        setSidebarItem('1')
                        navigate("/company")
                    }
                    else if (event.key == '2') {
                        setSidebarItem('2')
                        navigate("/my-documents")
                    }
                    else if (event.key == '3') {
                        setSidebarItem('3')
                        navigate("/shared-documents")
                    }
                    else if (event.key == '4') {
                        setSidebarItem('4')
                        navigate("/search")
                    }
                    else if (event.key == '5') {
                        setSidebarItem('5')
                        navigate("/trash")
                    }
                    else if (event.key == '6') {
                        setSidebarItem('6')
                        navigate("/ontology")
                    }
                    else if (event.key == '7') {
                        setSidebarItem('7')
                        navigate("/ontologyold")
                    }
                }}
            />
        </Sider>
    )
}

export default SideBar