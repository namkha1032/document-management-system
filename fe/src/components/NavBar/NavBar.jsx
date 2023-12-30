import { useState } from 'react';
import {
    SlidersOutlined,
    SearchOutlined
} from '@ant-design/icons';
import {
    Layout,
    theme,
    Typography,
    Switch,
    Input,
    Button,
    Row,
    Col,
    Avatar
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useQueryClient } from '@tanstack/react-query';
// //////////////////////////////////////////////////////


const AdvancedSearchButton = (props) => {
    return (
        <>
            <Button shape='circle' type={"text"}>
                <SlidersOutlined />
            </Button>
        </>
    )
}

const NavBar = () => {
    const antdTheme = theme.useToken()
    let queryClient = useQueryClient()
    let modeTheme = queryClient.getQueryData(['modeTheme'])
    return (
        <Layout.Header
            style={{
                paddingRight: `${antdTheme.token.paddingContentHorizontal}px`,
                paddingLeft: 0,
                background: antdTheme.token.colorBgContainer
            }}
        >
            <Row justify={"space-between"} align={"center"} style={{ height: "100%" }}>
                <Col md={10} style={{ display: "flex", alignItems: "center" }}>
                    <Input style={{ transition: "backgroundColor 0.215s" }}
                        prefix={<SearchOutlined />}
                        suffix={<AdvancedSearchButton />}
                    />
                </Col>
                <Col md={5} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", columnGap: 10 }}>
                    <Switch checked={queryClient.getQueryData(['modeTheme']) == "dark"}
                        checkedChildren={<FontAwesomeIcon icon={icon({ name: 'moon', style: 'solid' })} />}
                        unCheckedChildren={<FontAwesomeIcon icon={icon({ name: 'sun', style: 'solid' })} />}
                        onClick={(e) => {
                            if (e) {
                                window.localStorage.setItem("modeTheme", "dark")
                                queryClient.setQueryData(['modeTheme'], "dark")
                            }
                            else {
                                window.localStorage.setItem("modeTheme", "light")
                                queryClient.setQueryData(['modeTheme'], "light")
                            }
                        }} />
                    <Typography.Text>Peter Parker</Typography.Text>
                    <Avatar size={"large"} src="https://avatarfiles.alphacoders.com/149/149117.jpg" />
                </Col>
            </Row>
        </Layout.Header>
    )
}

export default NavBar