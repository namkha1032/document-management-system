import {
    Flex,
    Row,
    Col,
    theme,
    Switch,
    Typography
} from "antd"
import { useQueryClient } from "@tanstack/react-query"

const PageColor = () => {
    let queryClient = useQueryClient()
    let colorArray = []
    let controlArray = []
    const myTheme = theme.useToken()
    for (const [key, value] of Object.entries(myTheme.token)) {
        console.log(`${key}: ${value}`);
        console.log("typeof: ", typeof key)
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
            <Switch checked={queryClient.getQueryData(['theme']) == "dark"} onClick={(e) => {
                if (e) {
                    window.localStorage.setItem("dmsTheme", "dark")
                    queryClient.setQueryData(['theme'], "dark")
                }
                else {
                    window.localStorage.setItem("dmsTheme", "light")
                    queryClient.setQueryData(['theme'], "light")
                }
            }} />
            <Row gutter={[10, 10]} style={{
                backgroundColor: myTheme.token.colorBgBase
            }}>
                {colorArray}
            </Row >
        </>
    )
}

export default PageColor