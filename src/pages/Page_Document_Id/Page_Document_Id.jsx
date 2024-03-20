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
    Modal
} from "antd"
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
            <Bread breadProp={[
                {
                    "title": "Company documents",
                    "path": "/company"
                },
                {
                    "title": document?.versions[document.versions.length - 1].file_name,
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
                                    // style={{ backgroundColor: antdTheme.token.colorPrimaryBgHover }}
                                    >
                                        <Statistic title="Filename" value={document.versions[document.versions.length - 1].file_name} prefix={<TagOutlined />}
                                        // valueStyle={{ color: antdTheme.token.colorPrimaryActive }}
                                        />
                                    </Card>
                                </Col>
                                <Col md={10}>
                                    <Card styles={{
                                        body: {
                                            padding: 16
                                        }
                                    }}
                                    // style={{ backgroundColor: antdTheme.token.colorSuccessBgHover }}
                                    >
                                        <Statistic title="Created" value={new Date(document.created_date).toLocaleDateString()} prefix={<ClockCircleOutlined />}
                                        // valueStyle={{ color: antdTheme.token.colorSuccessActive }}
                                        />
                                    </Card>
                                </Col>
                                <Col md={10}>
                                    <Card styles={{
                                        body: {
                                            padding: 16
                                        }
                                    }}
                                    // style={{ backgroundColor: antdTheme.token.colorErrorBgHover }}
                                    >
                                        <Statistic title="File size" value={"1 MB"} prefix={<UngroupOutlined />}
                                        // valueStyle={{ color: antdTheme.token.colorErrorActive }}
                                        />
                                    </Card>
                                </Col>
                                <Col md={14}>
                                    <Card styles={{
                                        body: {
                                            padding: 16
                                        }
                                    }}
                                    // style={{ backgroundColor: antdTheme.token.colorWarningBgHover }}
                                    >
                                        <Statistic title="Owner" value={document.owner.first_name + " " + document.owner.last_name} prefix={<Avatar src={"/file/avatar.png"} />}
                                        // valueStyle={{ color: antdTheme.token.colorWarningActive }}
                                        />
                                    </Card>
                                </Col>
                                <Col md={24}>
                                    <Card title={"Metadata"} extra={<Button onClick={() => { setModalOpen(true) }}>Edit metadata</Button>}>
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
                    <Modal footer={null} style={{ top: 100 }} title="Edit metadata" open={modalOpen} maskClosable={true} onCancel={() => { setModalOpen(false) }}>
                        {newMetadata.map((item, index) => {
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