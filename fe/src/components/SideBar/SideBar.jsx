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
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import FolderTree from '../FolderTree/FolderTree';
// //////////////////////////////////////////////////////
const { Text, Title, Paragraph } = Typography
const { Header, Content, Footer, Sider } = Layout;

const MenuItem = (props) => {
    // props
    const selectedMenu = props.selectedMenu
    const setSelectedMenu = props.setSelectedMenu
    const menuIndex = props.menuIndex
    const menuName = props.menuName
    const collapsed = props.collapsed
    const startIcon = props.startIcon
    const inlineIcon = props.inlineIcon
    const setOpenFolderTree = props.setOpenFolderTree
    const darklightTheme = props.darklightTheme
    // hook
    const colorTheme = theme.useToken()
    return (
        <div style={{
            padding: menuIndex == 0 ? 0 : "0px 12px 8px 8px"
        }}>
            <Button
                type={selectedMenu == menuIndex ? "primary" : "text"}
                size={"large"}
                ghost={darklightTheme == "light" && selectedMenu == menuIndex ? true : false}
                block
                // icon={<MenuUnfoldOutlined />}
                style={{
                    // backgroundColor: selectedMenu == menuIndex ? "blue" : "grey",
                    // marginLeft: "4px",
                    // paddingRight: "4px",
                    // height: 40,
                    // width: collapsed ? 56 : 176,
                    backgroundColor: darklightTheme == "light" && selectedMenu == menuIndex ? colorTheme.token.colorPrimaryBg : null,
                    paddingLeft: collapsed ? 20 : 15,
                    transition: "width 0.215s, background-color 0.215s, padding 0.215s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
                onClick={() => {
                    setOpenFolderTree([])
                    setSelectedMenu(menuIndex)
                }}
            >
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    columnGap: 8
                }}>
                    {startIcon}
                    {collapsed ? null : menuName}
                </div>
                {inlineIcon}
            </Button>
        </div>
    )
}

const SideBar = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(0)
    const [openFolderTree, setOpenFolderTree] = useState([])
    const colorTheme = theme.useToken()

    let queryClient = useQueryClient()
    let darklightTheme = queryClient.getQueryData(['theme'])
    return (
        <Sider
            style={{
                // background: queryClient.getQueryData(['theme']) == "light" ? colorTheme.token.colorBgBase : "#001529" 
                background: colorTheme.token.colorBgContainer
            }}
            width="13%"
            collapsible collapsed={collapsed}
            trigger={
                <Flex
                    justify="center" align="center"
                    style={{ width: "100%", height: "100%", backgroundColor: colorTheme.token.colorBgContainer }}>
                    <Button
                        style={{ width: "100%", margin: colorTheme.token.marginXXS, backgroundColor: colorTheme.token.colorPrimaryBg, transition: "backgroundColor 0.215s" }}
                        type={darklightTheme == "dark" ? "primary" : "default"}
                        // type={"primary"}
                        ghost={darklightTheme == "dark" ? true : false}
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
                height: 56,
                // margin: `0 ${colorTheme.token.marginXXS}px`,
                padding: collapsed ? `0 ${36 - colorTheme.token.fontSizeHeading3 / 2}px` : `0 ${31 - colorTheme.token.fontSizeHeading3 / 2}px`,
                transition: "padding 0.215s"
            }}>
                <Html5Outlined
                    style={{ fontSize: colorTheme.token.fontSizeHeading3, color: colorTheme.token.colorTextBase }}
                />
                <Text strong={true} style={{
                    fontSize: colorTheme.token.fontSizeHeading3, whiteSpace: "nowrap",
                    display: collapsed ? "none" : "block"
                }}>
                    xCorp
                </Text>
            </div>
            <Collapse
                style={{ padding: 0 }}
                // collapsible='icon'
                bordered={false}
                size={"small"}
                ghost={true}
                onChange={(e) => { setOpenFolderTree(e) }}
                activeKey={openFolderTree[0] == 1 && collapsed == false && selectedMenu == 0 ? [1] : []}
                items={[
                    {
                        key: '1',
                        label:
                            <>
                                <MenuItem
                                    selectedMenu={selectedMenu}
                                    setSelectedMenu={setSelectedMenu}
                                    menuIndex={0}
                                    menuName={"My Documents"}
                                    collapsed={collapsed}
                                    startIcon={<UserOutlined />}
                                    inlineIcon={collapsed ? null : <RightOutlined rotate={openFolderTree[0] == 1 ? 90 : 0} />}
                                    setOpenFolderTree={setOpenFolderTree}
                                    darklightTheme={darklightTheme}
                                />
                            </>,
                        children: <FolderTree />,
                        showArrow: false,

                    },
                ]}
            />
            <MenuItem
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                menuIndex={1}
                menuName={"Shared with me"}
                collapsed={collapsed}
                startIcon={<TeamOutlined />}
                setOpenFolderTree={setOpenFolderTree}
                darklightTheme={darklightTheme}
            />
            <MenuItem
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                menuIndex={2}
                menuName={"Trash"}
                collapsed={collapsed}
                startIcon={<DeleteOutlined />}
                setOpenFolderTree={setOpenFolderTree}
                darklightTheme={darklightTheme}
            />

        </Sider>
    )
}

export default SideBar