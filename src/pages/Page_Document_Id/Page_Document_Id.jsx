import { useState, useEffect } from "react";
import {
    Typography,
    Row,
    Col,
    Card,
    theme,
    Table,
    Avatar,
    Button,
    Statistic,
    Input
} from "antd"
import Container from '@mui/material/Container';
import { CiShoppingTag } from "react-icons/ci";
import { AiFillSignal } from "react-icons/ai";
import {
    TagOutlined,
    ClockCircleOutlined,
    UngroupOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import { getDocument } from "../../apis/documentApi";
import Bread from "../../components/Bread/Bread";



const Page_Document_Id = () => {
    let [document, setDocument] = useState(null)
    let antdTheme = theme.useToken()
    let { document_id } = useParams()
    let userStorage = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        async function fetchData() {
            let documentResponse = await getDocument(userStorage.access_token, document_id)
            setDocument(documentResponse)
        }
        fetchData()
    }, [])
    function handleUpdateMetadata(key, value) {
        // original function in Page_Upload_Metadata.jsx
    }
    return (
        <>
            <Bread breadProp={[
                {
                    "title": "Company documents",
                    "path": "/company"
                },
                {
                    "title": document?.versions[document?.versions.length - 1].file_name,
                    "path": `/document/${document?.uid}`
                }
            ]}
            />
            {document
                ? <>
                    {/* <Container style={{ height: "100%" }}> */}
                    <Row gutter={[16, 16]} style={{ height: "100%" }}>
                        <Col md={16}>
                            <iframe src={document.versions[document.versions.length - 1].url} style={{ width: "100%", height: "100%" }}>
                            </iframe>
                        </Col>
                        <Col md={8}>
                            <Row gutter={[16, 16]}>
                                <Col md={14}>
                                    <Card styles={{
                                        body: {
                                            padding: 16
                                        }
                                    }}
                                        style={{ backgroundColor: antdTheme.token.colorPrimaryBgHover }}
                                    >
                                        <Statistic valueStyle={{ color: antdTheme.token.colorPrimaryActive }} title="Filename" value={"filename.pdf"} prefix={<TagOutlined />} />
                                    </Card>
                                </Col>
                                <Col md={10}>
                                    <Card styles={{
                                        body: {
                                            padding: 16
                                        }
                                    }}
                                        style={{ backgroundColor: antdTheme.token.colorSuccessBgHover }}>
                                        <Statistic valueStyle={{ color: antdTheme.token.colorSuccessActive }} title="Created" value={"2024-01-01"} prefix={<ClockCircleOutlined />} />
                                    </Card>
                                </Col>
                                <Col md={10}>
                                    <Card styles={{
                                        body: {
                                            padding: 16
                                        }
                                    }}
                                        style={{ backgroundColor: antdTheme.token.colorErrorBgHover }}>
                                        <Statistic valueStyle={{ color: antdTheme.token.colorErrorActive }} title="File size" value={"1 MB"} prefix={<UngroupOutlined />} />
                                    </Card>
                                </Col>
                                <Col md={14}>
                                    <Card styles={{
                                        body: {
                                            padding: 16
                                        }
                                    }}
                                        style={{ backgroundColor: antdTheme.token.colorWarningBgHover }}>
                                        <Statistic valueStyle={{ color: antdTheme.token.colorWarningActive }} title="Owner" value={"Nguyen Nam Kha"} prefix={<Avatar src={"/file/avatar.png"} />} />
                                    </Card>
                                </Col>
                                <Col md={24}>
                                    <Card title={"Metadata"}>
                                        {document.versions[document.versions.length - 1].metadata.map((item, index) => {
                                            return (<Row key={index} style={{ marginTop: 8 }} gutter={[8, 8]}>
                                                <Col span={10}>
                                                    <Typography.Text>{Object.entries(item)[0][0]}</Typography.Text>
                                                </Col>
                                                <Col span={14}>
                                                    {Object.entries(item)[0][0] == 'Văn bản liên quan'
                                                        ? JSON.parse(Object.entries(item)[0][1].replaceAll("'", '"')).map((ite, index, arr) =>
                                                            <Input.TextArea style={{ marginBottom: index + 1 == arr.length ? 0 : 8 }} key={index} autoSize={{ minRows: 1, maxRows: 4 }} value={ite} />
                                                        )
                                                        : <Input.TextArea onChange={(e) => handleUpdateMetadata(Object.entries(item)[0][0], e.target.value)} autoSize={{ minRows: 1, maxRows: 4 }} value={Object.entries(item)[0][1]} />
                                                    }

                                                </Col>
                                            </Row>)
                                        }
                                        )}
                                    </Card>
                                </Col>
                                <Col md={24}>
                                    <Button style={{ width: "100%" }} type="primary">Lock file</Button>
                                </Col>
                                <Col md={24}>
                                    <Button style={{ width: "100%" }} type="primary">Manage access</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* </Container> */}
                </>
                : <>
                    <Typography.Text>Loading</Typography.Text>
                </>
            }
        </>
    )
}

export default Page_Document_Id