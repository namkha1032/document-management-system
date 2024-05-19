import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Input,
    Modal,
    Popconfirm,
    Result,
    Row,
    Skeleton,
    Table,
    Typography,
    Space,
    message,
    theme
} from "antd";
import { useEffect, useState } from "react";
// import Skeleton from '@mui/material/Skeleton';
import {
    ClockCircleOutlined,
    DeleteOutlined,
    RollbackOutlined,
    TagOutlined,
    UngroupOutlined,
    DownloadOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import { FaGlobeAsia } from "react-icons/fa";
import { MdVpnKey } from "react-icons/md";
import { saveAs } from 'file-saver';
import { GoVersions } from "react-icons/go";
import { AiOutlineAudit } from "react-icons/ai";

import axios from "axios";
import prettyBytes from 'pretty-bytes';
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { apiGetDocument, apiRestoreVersion, apiUpdateMetadata, apiDeleteDocument } from "../../apis/documentApi";
import Bread from "../../components/Bread/Bread";
import FormEditMetadata from "../../components/FormEditMetadata/FormEditMetadata";
import PermissionModal from "../../components/PermissionModal/PermissionModal";
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

const ModalUpdateMetadata = (props) => {
    let document = props.document
    let setDocument = props.setDocument
    let { document_id } = useParams()
    let userStorage = JSON.parse(localStorage.getItem("user"))
    let [modalOpen, setModalOpen] = useState(false)
    let [loadingUpdateMetadata, setLoadingUpdateMetadata] = useState(false)
    let [newMetadata, setNewMetadata] = useState(null)
    let [comment, setComment] = useState("")
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
        let documentResponse = await apiGetDocument(document_id, document.logCurrent, document.logPageSize)
        // let documentCopy = await getDocumentSize(documentResponse)
        console.log("documentResponse", documentResponse)
        setDocument(documentResponse)
        setNewMetadata(documentResponse.versions[0].metadata)
        setComment("")
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
                <FormEditMetadata newMetadata={newMetadata} setNewMetadata={setNewMetadata} />
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

async function getDocumentSize(documentResponse) {
    let documentCopy = JSON.parse(JSON.stringify(documentResponse))
    let documentPromise = documentResponse.versions.map(async (docver, idx) => {
        let fileResponse = await axios.get(documentResponse.versions[0].url !== "" ? documentResponse.versions[0].url : "https://pdfobject.com/pdf/sample.pdf")
        let size = prettyBytes(parseInt(fileResponse.headers.get('Content-Length')));
        documentCopy.versions[idx]["size"] = size
    })
    await Promise.all(documentPromise)
    return documentCopy
}
const DownloadButton = (props) => {
    let documentUrl = props.documentUrl
    let documentFileName = props.documentFileName
    async function handleDownloadDocument() {
        // const a = document.createElement("a");
        // a.href = documentUrl;
        // const clickEvnt = new MouseEvent("click", {
        //     view: window,
        //     bubbles: true,
        //     cancelable: true,
        // });

        // a.dispatchEvent(clickEvnt);
        // a.remove();
        // saveAs(documentUrl, documentFileName)
        // const response = await fetch(documentUrl)
        // let fileBlob = await response.blob()
        // console.log("download", fileBlob)
        // const blob = new Blob([documentUrl], { type: 'application/pdf' });
        // const tempLink = document.createElement('a');
        // tempLink.href = window.URL.createObjectURL(blob);
        // tempLink.setAttribute('download', documentFileName);
        // tempLink.click();
        // const anchor = document.createElement('a');
        // anchor.href = documentUrl;
        // anchor.download = documentFileName;
        // // document.body.appendChild(anchor);
        // // anchor.click();
        // // Cleanup
        // // document.body.removeChild(anchor);
        // // URL.revokeObjectURL(documentUrl);


        // // Simulate a click event
        // anchor.dispatchEvent(new MouseEvent('click', {
        //     bubbles: true,
        //     cancelable: true,
        //     view: window
        // }));

        // // Remove the anchor element from the DOM
        // document.body.removeChild(anchor);
    }
    return (
        <>
            <Button icon={<DownloadOutlined />} onClick={() => { handleDownloadDocument() }}>Download</Button>
            {/* <Link to={documentUrl} target="_blank" download>Download</Link> */}
            {/* <a href={documentUrl} download>Click to download</a> */}

        </>
    )
}
const Page_Document_Id = () => {
    const [messageApi, contextHolder] = message.useMessage();
    let [document, setDocument] = useState(null)
    let [restoreLoading, setRestoreLoading] = useState(false)
    let [isAllowed, setIsAllowed] = useState(true)
    let [modalDeleteOpen, setModalDeleteOpen] = useState(false)
    let [loadingDelete, setLoadingDelete] = useState(false)
    let [loadingLog, setLoadingLog] = useState(false)
    let [log, setLog] = useState([])
    let antdTheme = theme.useToken()
    let { document_id } = useParams()
    const { state } = useLocation();
    let userStorage = JSON.parse(localStorage.getItem("user"))
    console.log("Page_Document_Id: document: ", document)
    const navigate = useNavigate()
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
    let logColumns = [
        {
            "title": "Time",
            "render": ((obj) => <>
                <Typography.Text>{new Date(new Date(obj.time + "Z").toJSON()).toLocaleString()}</Typography.Text>
            </>)
        },
        {
            "title": "User",
            "render": ((obj) => <>
                <Typography.Text>{`${obj.modified_by.first_name} ${obj.modified_by.last_name}`}</Typography.Text>
            </>)
        },
        {
            "title": "Action",
            "render": ((obj) => <>
                <Typography.Text>{`${obj.action}`}</Typography.Text>
            </>)
        },
        {
            "title": "Description",
            "render": ((obj) => <>
                <Typography.Text ellipsis>{`${obj.description}`}</Typography.Text>
            </>)
        },
    ]
    useEffect(() => {
        async function fetchData() {
            let documentResponse = await apiGetDocument(document_id)
            let documentCopy = { ...documentResponse, versions: documentResponse.versions.map(item => ({ ...item, file_size: Number(item.file_size || 0) })) }
            let findUser = documentCopy.users_with_permission.find((item, idx) => item.email === userStorage.email)
            if (!findUser && documentCopy.owner.email !== userStorage.email) {
                setIsAllowed(false)
            }
            setDocument(documentCopy)
        }
        fetchData()
    }, [document_id])
    async function handleRestoreVersion(versionUid) {
        setRestoreLoading(true)
        let restoreResponse = await apiRestoreVersion(document.uid, versionUid)
        let documentResponse = await apiGetDocument(document_id, document.logCurrent, document.logPageSize)
        // let documentCopy = await getDocumentSize(documentResponse)
        setDocument(documentResponse)
        setRestoreLoading(false)
        messageApi.open({
            content: <Alert style={{ fontSize: 24 }} showIcon type="success" message="Version has been reverted successfully" closable />,
            className: 'namkha-message',
        });
    }
    async function handleDeleteDocument() {
        setLoadingDelete(true)
        await apiDeleteDocument(document_id)
        let breadState = state?.breadState
        if (breadState) {
            navigate(breadState[0]?.path)
        }
        else {
            navigate(-1)
        }
        setLoadingDelete(false)
    }
    async function handleLogPaginationChange(page, pageSize) {
        // await searchMutation.mutateAsync(newSearchOption)
        setLoadingLog(true)
        let documentResponse = await apiGetDocument(document.uid, page, pageSize)
        let newResponse = {
            ...document,
            logs: documentResponse.logs,
            logCurrent: page,
            logPageSize: pageSize,
            logTotal: documentResponse.logTotal
        }
        setDocument(newResponse)
        setLoadingLog(false)
    }
    // ///////////////////////////////////////////////////////

    // console.log(watch("example")) // watch input value by passing the name of it
    // ///////////////////////////////////////////////////////
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Modal title={
                <div style={{ display: 'flex', alignItems: "center", columnGap: 8 }}>
                    <ExclamationCircleFilled style={{ color: antdTheme.token.colorWarning, fontSize: 22 }} />
                    <Typography.Title level={4} style={{ margin: 0 }}>Delete document</Typography.Title>
                </div>} open={modalDeleteOpen} maskClosable={true} onCancel={() => { setModalDeleteOpen(false) }}
                onOk={() => { handleDeleteDocument() }}
                cancelText="No"
                okText="Yes"
                centered
                confirmLoading={loadingDelete}
            >
                <Typography.Text>Are you sure you want to delete this document?</Typography.Text>
            </Modal>
            {contextHolder}
            {isAllowed
                ?
                <div style={{ flex: "0 1 auto" }}>
                    <Bread breadSelectedDoc={document} breadProp={[
                        {
                            "title": "Document",
                            "path": "/company"
                        },
                        {
                            "title": document?.versions[0].file_name !== "" ? document?.versions[0].file_name : document.uid,
                            "path": `/document/${document?.uid}`
                        }
                    ]}
                    // extraComponent={<DownloadButton documentUrl={document?.versions[0].url.length > 0 ?
                    //     document?.versions[0].url
                    //     : "https://pdfobject.com/pdf/sample.pdf"}
                    //     documentFileName={
                    //         document?.versions[0].file_name.length > 0 ?
                    //             document?.versions[0].file_name.slice(0, -16)
                    //             : "sample.pdf"
                    //     } />}
                    />
                </div>
                : null}
            <div
                id={"documentFeed"}
                style={{
                    width: document && isAllowed ? "100%" : 0,
                    height: document && isAllowed ? 'fit-content' : 0,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    flex: "1 1 auto"
                }}
            >
                <Row gutter={[16, 16]}>
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
                                <VjpStatistic direction={"vertical"} title={"File size"} prefix={<UngroupOutlined />} value={document ? prettyBytes(parseInt(document.versions[0].file_size)) : null} />
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
                                    height: document ? "100%" : 0, transition: "height 0.3s, min-height 0.3s", overflow: "hidden", minHeight: document ? 500 : 0,
                                    borderColor: antdTheme.token.colorBorder
                                }} title={"Metadata"} extra={<ModalUpdateMetadata document={document} setDocument={setDocument} />}>
                                    {document?.versions[0].metadata.map((item, index) => {
                                        return (<Row key={index} style={{ marginTop: 8 }} gutter={[8, 8]}>
                                            <Col span={10}>
                                                <Typography.Text>{Object.entries(item)[0][0]}</Typography.Text>
                                            </Col>
                                            <Col span={14}>
                                                {Object.entries(item)[0][0] === 'Văn bản liên quan'
                                                    ? JSON.parse(Object.entries(item)[0][1].replaceAll("'", '"')).map((ite, index, arr) =>
                                                        <Input.TextArea style={{ marginBottom: index + 1 === arr.length ? 0 : 8 }} key={index} autoSize={{ minRows: 1, maxRows: 4 }} value={ite} />
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
                            {userStorage?.email === document?.owner?.email
                                ? <Col md={8}>
                                    <PermissionModal document={document} setDocument={setDocument}
                                        modalButton={
                                            <TagButton icon={<MdVpnKey />} color="geekblue" columnGap={8}>
                                                Manage access
                                            </TagButton>
                                        } />
                                </Col>
                                : null}

                            {userStorage?.email === document?.owner?.email
                                ? <Col md={8}>
                                    <TagButton icon={<FaGlobeAsia />} color="green" columnGap={8} >
                                        Public file
                                    </TagButton>
                                </Col>
                                : null}

                            {userStorage?.email === document?.owner?.email
                                ? <Col md={8}>
                                    <TagButton handleClick={() => { setModalDeleteOpen(true) }} icon={<DeleteOutlined />} color="red" columnGap={8}>
                                        Delete file
                                    </TagButton>
                                </Col>
                                : null}
                        </Row>
                    </Col>
                </Row>
                <div style={{ display: "flex", alignItems: "center", columnGap: 16, marginTop: 24, marginBottom: 16 }}>
                    <GoVersions style={{ fontSize: 24 }} />
                    <Typography.Title level={2} style={{ margin: 0 }}>Version control</Typography.Title>
                </div>

                <Table
                    columns={versionColumns}
                    rowKey={(record) => record?.id}
                    dataSource={document?.versions}
                    style={{
                        borderRadius: 8, cursor: "pointer",
                        border: `1px solid ${antdTheme.token.colorBorder}`
                    }}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                        position: ['bottomCenter']
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
                <div style={{ display: "flex", alignItems: "center", columnGap: 16, marginTop: 24, marginBottom: 16 }}>
                    <AiOutlineAudit style={{ fontSize: 24 }} />
                    <Typography.Title level={2} style={{ margin: 0 }}>Audit log</Typography.Title>
                </div>
                <Table
                    columns={logColumns}
                    rowKey={(record) => record?.uid}
                    dataSource={document?.logs}
                    style={{
                        borderRadius: 8, cursor: "pointer",
                        border: `1px solid ${antdTheme.token.colorBorder}`
                    }}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                        current: document?.logCurrent,
                        pageSize: document?.logPageSize,
                        total: document?.logTotal,
                        position: ['bottomCenter']
                    }}
                    loading={loadingLog}
                    onChange={(pag) => { handleLogPaginationChange(pag.current, pag.pageSize) }}
                />
            </div>
            {isAllowed === false ?
                <div style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<Button onClick={() => { navigate(`/company`) }} type="primary">Back Home</Button>}
                    />
                </div>
                : null}
            {document === null
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
        </div>
    )
}

export default Page_Document_Id