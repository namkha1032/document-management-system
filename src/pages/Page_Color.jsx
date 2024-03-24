import {
    Flex,
    Row,
    Col,
    theme,
    Switch,
    Typography,
    Affix
} from "antd"
import { useState, useContext } from "react"
// import context
import ModeThemeContext from "../context/ModeThemeContext"
const PageColor = () => {
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let colorArray = []
    let controlArray = []
    const antdTheme = theme.useToken()
    for (const [key, value] of Object.entries(antdTheme.token)) {
        if (key.toLowerCase().includes("color")
            || key == "controlItemBgActive" || key == "controlItemBgActiveDisabled" || key == "controlItemBgActiveHover"
            || key == "controlItemBgHover" || key == "controlOutline") {
            colorArray.push(
                <Col span={3}>
                    <Flex vertical justify="space-between">
                        <div
                            style={{
                                backgroundColor: value,
                                height: 100,
                            }}>
                        </div>
                        <Typography.Paragraph>{key}</Typography.Paragraph>
                        <Typography.Paragraph>{value}</Typography.Paragraph>
                    </Flex>
                </Col>
            )
        }
    }
    return (
        <>

            <Affix offsetTop={10}>
                <Switch checked={modeTheme == "dark"} onClick={(e) => {
                    if (e) {
                        dispatchModeTheme({ type: 'dark' })
                    }
                    else {
                        dispatchModeTheme({ type: 'light' })
                    }
                }} />
            </Affix>
            <Row gutter={[10, 10]} style={{
                backgroundColor: antdTheme.token.colorBgBase
            }}>
                {colorArray}
            </Row >
        </>
    )
}

export default PageColor