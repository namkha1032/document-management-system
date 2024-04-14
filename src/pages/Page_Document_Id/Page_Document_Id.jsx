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
    Skeleton,
    Popconfirm,
    message,
    Alert,
    Tag
} from "antd"
// import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { CiShoppingTag } from "react-icons/ci";
import { AiFillSignal } from "react-icons/ai";
import {
    TagOutlined,
    ClockCircleOutlined,
    UngroupOutlined,
    CloseOutlined,
    PlusOutlined,
    RollbackOutlined,
    StopOutlined
} from '@ant-design/icons';
import { MdVpnKey } from "react-icons/md";
import { FaLock, FaGlobeAsia } from "react-icons/fa";

import { useParams, useNavigate } from "react-router-dom";
import { apiGetDocument, apiUpdateMetadata, apiRestoreVersion } from "../../apis/documentApi";
import Bread from "../../components/Bread/Bread";
import randomString from "../../functions/randomString";
import PermissionModal from "../../components/PermissionModal/PermissionModal";
import MetadataUpdateForm from "../../components/MetadataUpdateForm/MetadataUpdateForm";
import TagButton from "../../components/TagButton/TagButton";
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

const NewMetaPair = (props) => {
    let [newKey, setNewKey] = useState("")
    let [newValue, setNewValue] = useState("")
    return (
        <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            <Col span={2}>
                <Button shape="circle" icon={<PlusOutlined />} />
            </Col>
            <Col span={7}>
                <Input placeholder="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            </Col>
            <Col span={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography.Text>:</Typography.Text>
            </Col>
            <Col span={14}>
                <Input placeholder="value" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
            </Col>
        </Row>
    )
}
const ModalUpdateMetadata = (props) => {
    let document = props.document
    let setDocument = props.setDocument
    let { document_id } = useParams()
    let userStorage = JSON.parse(localStorage.getItem("user"))
    let [modalOpen, setModalOpen] = useState(false)
    let [loadingUpdateMetadata, setLoadingUpdateMetadata] = useState(false)
    let [newMetadata, setNewMetadata] = useState(null)
    let [comment, setComment] = useState("")
    console.log("newMetadata: ", newMetadata)
    useEffect(() => {
        setNewMetadata(document?.versions[0].metadata)
    }, [document])
    // ///////////////////////////////////////////////

    // ///////////////////////////////////////////////
    async function handleUpdateMetadata() {
        setLoadingUpdateMetadata(true)
        // original function in Page_Upload_Metadata.jsx
        let newForm = new FormData()
        // newForm.append('files', uploadDocument.fileList[0])
        newForm.append("data", JSON.stringify({
            "message": comment,
            "metadata": newMetadata
        }))
        let response = await apiUpdateMetadata(userStorage.access_token, document_id, newForm)
        let documentResponse = await apiGetDocument(document_id)
        setDocument(documentResponse)
        setNewMetadata(documentResponse.versions[0].metadata)
        setLoadingUpdateMetadata(false)
        setModalOpen(false)
    }
    function resetMetadata() {
        setNewMetadata(document.versions[0].metadata)
    }
    return (
        <>
            <Button onClick={() => { setModalOpen(true) }}>Edit metadata</Button>
            <Modal footer={null} width={700} style={{ top: 100 }} title="Edit metadata" open={modalOpen} maskClosable={true} onCancel={() => { setModalOpen(false) }}>
                <MetadataUpdateForm newMetadata={newMetadata} setNewMetadata={setNewMetadata} />
                <Row gutter={[8, 8]} justify={"end"}>
                    <Col md={24}>
                        <Typography.Title level={4}>Add some message</Typography.Title>
                        <Input.TextArea value={comment} onChange={(e) => { setComment(e.target.value) }} placeholder="enter your message..." />
                    </Col>
                </Row>
                <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: 'flex-end', columnGap: 8 }}>
                    <Button onClick={() => { resetMetadata() }}>Reset to default</Button>
                    <Button loading={loadingUpdateMetadata} type="primary" onClick={() => { handleUpdateMetadata() }}>Save</Button>
                </div>
            </Modal>
        </>
    )
}
const Page_Document_Id = () => {
    const [messageApi, contextHolder] = message.useMessage();
    let [document, setDocument] = useState(null)
    let [restoreLoading, setRestoreLoading] = useState(false)
    let antdTheme = theme.useToken()
    let { document_id } = useParams()
    let userStorage = JSON.parse(localStorage.getItem("user"))
    console.log("Page_Document_Id: document: ", document)

    let versionColumns = [
        {
            "title": "VersionID",
            "render": ((obj) => <>
                <Typography.Text>{obj.id}</Typography.Text>
            </>)
        },
        {
            "title": "Created date",
            "render": ((obj) => <>
                <Typography.Text>{new Date(obj.created_date).toLocaleString()}</Typography.Text>
            </>)
        },
        {
            "title": "Updated date",
            "render": ((obj) => <>
                <Typography.Text>{new Date(obj.updated_date).toLocaleString()}</Typography.Text>
            </>)
        },
        {
            "title": "User",
            "render": ((obj) => <>
                <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                    <Avatar src={`/file/avatar.png`} />
                    <Typography.Text>{obj.user.first_name + " " + obj.user.last_name}</Typography.Text>
                </div>
            </>)
        },
        {
            "title": "Message",
            "render": ((obj) => <>
                <Typography.Text>{obj.message}</Typography.Text>
            </>)
        },
        {
            "title": "Action",
            "render": ((obj) => <>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => { handleRestoreVersion(obj.uid) }}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                        loading: restoreLoading
                    }}>
                    <Button type="text" style={{ padding: 0 }} icon={<RollbackOutlined />}>Restore</Button>
                </Popconfirm>
            </>)
        }
    ]
    useEffect(() => {
        async function fetchData() {
            let documentResponse = await apiGetDocument(document_id)
            setDocument(documentResponse)
        }
        fetchData()
    }, [])
    async function handleRestoreVersion(versionUid) {
        setRestoreLoading(true)
        let restoreResponse = await apiRestoreVersion(document.uid, versionUid)
        let documentResponse = await apiGetDocument(document_id)
        setDocument(documentResponse)
        setRestoreLoading(false)
        messageApi.open({
            content: <Alert style={{ fontSize: 24 }} showIcon type="success" message="Version has been reverted successfully" closable />,
            className: 'namkha-message',
        });
    }
    async function handleLockFile() {

    }
    // ///////////////////////////////////////////////////////

    // console.log(watch("example")) // watch input value by passing the name of it
    // ///////////////////////////////////////////////////////
    return (
        <>
            {contextHolder}
            <Bread breadSelectedDoc={document} breadProp={[
                {
                    "title": "Company documents",
                    "path": "/company"
                },
                {
                    "title": document?.versions[0].file_name,
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
                                    <Statistic formatter={(val) => <Typography.Text ellipsis style={{ fontSize: 24 }}>{val}</Typography.Text>} title="Filename" value={document?.versions[0].file_name} prefix={<TagOutlined />} />
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
                                    height: document ? "100%" : 0, transition: "height 0.3s, min-height 0.3s", overflow: "hidden", minHeight: document ? 400 : 0,
                                    borderColor: antdTheme.token.colorBorder
                                }} title={"Metadata"} extra={<ModalUpdateMetadata document={document} setDocument={setDocument} />}>
                                    {document?.versions[0].metadata.map((item, index) => {
                                        return (<Row key={index} style={{ marginTop: 8 }} gutter={[8, 8]}>
                                            <Col span={10}>
                                                <Typography.Text>{Object.entries(item)[0][0]}</Typography.Text>
                                            </Col>
                                            <Col span={14}>
                                                {Object.entries(item)[0][0] == 'Văn bản liên quan'
                                                    ? JSON.parse(Object.entries(item)[0][1].replaceAll("'", '"')).map((ite, index, arr) =>
                                                        <Input.TextArea style={{ marginBottom: index + 1 == arr.length ? 0 : 8 }} key={index} autoSize={{ minRows: 1, maxRows: 4 }} value={ite} />
                                                    )
                                                    : <Input.TextArea
                                                        // onChange={(e) => handleUpdateMetadata(Object.entries(item)[0][0], e.target.value)} 
                                                        autoSize={{ minRows: 1, maxRows: 4 }} value={Object.entries(item)[0][1]} />
                                                }

                                            </Col>
                                        </Row>)
                                    }
                                    )}
                                </Card>
                            </Col>
                            <Col md={8}>
                                <PermissionModal document={document} setDocument={setDocument}
                                    modalButton={
                                        <TagButton icon={<MdVpnKey />} color="geekblue" >
                                            Manage access
                                        </TagButton>
                                    } />
                            </Col>
                            <Col md={8}>
                                <TagButton icon={<FaGlobeAsia />} color="green" >
                                    Public file
                                </TagButton>
                            </Col>
                            <Col md={8}>
                                <TagButton icon={<FaLock />} color="volcano" handleClick={handleLockFile}>
                                    Lock file
                                </TagButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Typography.Title level={2}>Version control</Typography.Title>
                <Table
                    columns={versionColumns}
                    rowKey={(record) => record?.id}
                    dataSource={document?.versions}
                    style={{
                        borderRadius: 8, cursor: "pointer",
                    }}
                // pagination={false}
                // loading={documentResult.loading}
                // rowSelection={{
                //     hideSelectAll: true,
                //     type: "checkbox",
                //     onChange: (selectedRowKeys, selectedRows) => {
                //         setSelectedDoc(selectedRows)
                //         setSelectedKey(selectedRowKeys)
                //     },
                //     selectedRowKeys: selectedKey
                // }}
                />

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