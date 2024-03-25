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
    Input,
    Modal,
    Skeleton
} from "antd"
// import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { CiShoppingTag } from "react-icons/ci";
import { AiFillSignal } from "react-icons/ai";
import {
    TagOutlined,
    ClockCircleOutlined,
    UngroupOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import { getDocument } from "../../apis/documentApi";
import Bread from "../../components/Bread/Bread";
import { updateMetadata } from "../../apis/documentApi";

const VjpStatistic = (props) => {
    const title = props.title
    const value = props.value
    const prefix = props.prefix
    const direction = props.direction
    let antdTheme = theme.useToken()
    let fSize = 24
    return (
        <Card styles={{
            body: {
                padding: 16
            }
        }}
            style={{
                transition: direction == "horizontal" ? "width 0.3s" : "height 0.3s",
                width: direction == "horizontal" ? (value ? "100%" : 0) : "100%",
                height: direction == "vertical" ? (value ? "100%" : 0) : "100%",
                overflow: "hidden",
                borderWidth: value ? "1px" : "0px",
                borderColor: antdTheme.token.colorBorder
            }}
        >
            <Typography.Text ellipsis type="secondary">{title}</Typography.Text>
            <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                <Typography.Text style={{ fontSize: fSize, display: "flex", alignItems: "center" }}>
                    {prefix}
                </Typography.Text>
                <Typography.Text style={{ fontSize: fSize }} ellipsis>{value}</Typography.Text>
            </div>
        </Card>
    )
}

const Page_Document_Id = () => {
    let [modalOpen, setModalOpen] = useState(false)
    let [document, setDocument] = useState(null)
    let [newMetadata, setNewMetadata] = useState(null)
    let [loadingUpdateMetadata, setLoadingUpdateMetadata] = useState(false)
    console.log("newMetadata", newMetadata)
    let antdTheme = theme.useToken()
    let { document_id } = useParams()
    let userStorage = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        async function fetchData() {
            let documentResponse = await getDocument(userStorage.access_token, document_id)
            setDocument(documentResponse)
            setNewMetadata(documentResponse.versions[documentResponse.versions.length - 1].metadata)
        }
        fetchData()
    }, [])
    console.log("document in Page", document)
    async function handleUpdateMetadata(key, value) {
        setLoadingUpdateMetadata(true)
        // original function in Page_Upload_Metadata.jsx
        let newForm = new FormData()
        // newForm.append('files', uploadDocument.fileList[0])
        newForm.append("data", JSON.stringify({
            "message": "update metadata",
            "metadata": newMetadata
        }))
        console.log("newForm: ", newForm)
        let response = await updateMetadata(userStorage.access_token, document_id, newForm)
        let documentResponse = await getDocument(userStorage.access_token, document_id)
        setDocument(documentResponse)
        setNewMetadata(documentResponse.versions[documentResponse.versions.length - 1].metadata)
        setLoadingUpdateMetadata(false)
        setModalOpen(false)
    }
    function deleteMetadataPair(index) {
        let newlyMetadataPair = JSON.parse(JSON.stringify(newMetadata))
        newlyMetadataPair.splice(index, 1)
        setNewMetadata(newlyMetadataPair)
    }
    return (
        <>
            <Bread breadSelectedDoc={document} breadProp={[
                {
                    "title": "Company documents",
                    "path": "/company"
                },
                {
                    "title": document?.versions[document?.versions.length - 1].file_name,
                    "path": `/document/${document?.uid}`
                }
            ]}
            /><div
                style={{
                    width: document ? "100%" : 0,
                    height: document ? 'fit-content' : 0,
                    overflow: "hidden"
                }}
            >
                <Row gutter={[16, 16]} style={{ height: "100%" }}>
                    <Col md={16}>
                        <div style={{ borderRadius: 8, width: document ? "100%" : 0, height: document ? "100%" : 0, transition: " height 0.3s" }}>
                            <iframe src={document?.versions[0].url.length > 0 ? document?.versions[0].url : "https://pdfobject.com/pdf/sample.pdf"}
                                style={{ borderRadius: 8, borderWidth: 0, width: "100%", height: "100%" }}>
                            </iframe>
                        </div>
                    </Col>
                    <Col md={8}>
                        <Row gutter={[16, 16]}>
                            <Col md={14}>
                                {/* <Card styles={{
                                    body: {
                                        padding: 16
                                    }
                                }}
                                // style={{ backgroundColor: antdTheme.token.colorPrimaryBgHover }}
                                >
                                    <Statistic formatter={(val) => <Typography.Text ellipsis style={{ fontSize: 24 }}>{val}</Typography.Text>} title="Filename" value={document?.versions[document?.versions.length - 1].file_name} prefix={<TagOutlined />} />
                                </Card> */}
                                <VjpStatistic direction={"horizontal"} title={"Filename"} prefix={<TagOutlined />} value={document ? (document?.versions[0].file_name ? document?.versions[0].file_name : document?.uid) : null} />

                            </Col>
                            <Col md={10} style={{ display: "flex", alignItems: "flex-start" }}>
                                {/* <Card styles={{
                                    body: {
                                        padding: 16
                                    }
                                }}
                                // style={{ backgroundColor: antdTheme.token.colorSuccessBgHover }}
                                >
                                    <Statistic title="Created" value={new Date(document?.created_date).toLocaleDateString()} prefix={<ClockCircleOutlined />}
                                    // valueStyle={{ color: antdTheme.token.colorSuccessActive }}
                                    />
                                </Card> */}
                                <VjpStatistic direction={"vertical"} title={"Created"} prefix={<ClockCircleOutlined />} value={document ? new Date(document?.created_date).toLocaleDateString() : null} />

                            </Col>
                            <Col md={10} style={{ display: 'flex', alignItems: "flex-end" }}>
                                {/* <Card styles={{
                                    body: {
                                        padding: 16
                                    }
                                }}
                                // style={{ backgroundColor: antdTheme.token.colorErrorBgHover }}
                                >
                                    <Statistic title="File size" value={"1 MB"} prefix={<UngroupOutlined />}
                                    // valueStyle={{ color: antdTheme.token.colorErrorActive }}
                                    />
                                </Card> */}
                                <VjpStatistic direction={"vertical"} title={"File size"} prefix={<UngroupOutlined />} value={document ? "1 MB" : null} />

                            </Col>
                            <Col md={14} style={{ display: "flex", justifyContent: "flex-end" }}>
                                {/* <Card styles={{
                                    body: {
                                        padding: 16
                                    }
                                }}
                                // style={{ backgroundColor: antdTheme.token.colorWarningBgHover }}
                                >
                                    <Statistic title="Owner" value={document?.owner.first_name + " " + document?.owner.last_name} prefix={<Avatar src={"/file/avatar.png"} />}
                                    // valueStyle={{ color: antdTheme.token.colorWarningActive }}
                                    />
                                </Card> */}

                                <VjpStatistic direction={"horizontal"} title={"Owner"} prefix={< Avatar src={"/file/avatar.png"} />} value={document ? document?.owner.first_name + " " + document?.owner.last_name : null} />
                            </Col>
                            <Col md={24}>
                                <Card style={{
                                    height: document ? "100%" : 0, transition: "height 0.3s", overflow: "hidden",
                                    borderColor: antdTheme.token.colorBorder
                                }} title={"Metadata"} extra={<Button onClick={() => { setModalOpen(true) }}>Edit metadata</Button>}>
                                    {document?.versions[document?.versions.length - 1].metadata.map((item, index) => {
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
                <Modal footer={null} style={{ top: 100 }} title="Edit metadata" open={modalOpen} maskClosable={true} onCancel={() => { setModalOpen(false) }}>
                    {newMetadata && newMetadata?.map((item, index) => {
                        return (<Row key={index} style={{ marginTop: 8 }} gutter={[8, 8]}>
                            <Col span={8}>
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
                            <Col span={2}>
                                <Button onClick={() => deleteMetadataPair(index)} type={"text"} shape={"circle"} icon={<CloseOutlined />}>

                                </Button>
                            </Col>
                        </Row>)
                    }
                    )}
                    <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: 'flex-end' }}>
                        <Button loading={loadingUpdateMetadata} type="primary" onClick={() => handleUpdateMetadata()}>Save</Button>
                    </div>
                </Modal>
            </div>
            {document == null
                ? <>
                    <Row gutter={[16, 16]} style={{ height: "100%" }}>
                        <Col md={16}>
                            <Skeleton.Button active block className="mySkele" />
                        </Col>
                        <Col md={8}>
                            <Row gutter={[16, 16]} style={{ height: "100%" }}>
                                <Col md={14} style={{ height: "10%" }}>
                                    <Skeleton.Button active block className="mySkele" />
                                </Col>
                                <Col md={10} style={{ height: "10%" }}>
                                    <Skeleton.Button active block className="mySkele" />
                                </Col>
                                <Col md={10} style={{ height: "10%" }}>
                                    <Skeleton.Button active block className="mySkele" />
                                </Col>
                                <Col md={14} style={{ height: "10%" }}>
                                    <Skeleton.Button active block className="mySkele" />
                                </Col>
                                <Col md={24} style={{ height: "60%" }}>
                                    <Skeleton.Button active block className="mySkele" />
                                </Col>
                                <Col md={24} style={{ height: "10%" }}>
                                    <Skeleton.Button active block className="mySkele" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </>
                : null}
        </>
    )
}

export default Page_Document_Id