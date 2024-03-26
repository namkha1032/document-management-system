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
import { useForm, Controller } from "react-hook-form"
// import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { CiShoppingTag } from "react-icons/ci";
import { AiFillSignal } from "react-icons/ai";
import {
    TagOutlined,
    ClockCircleOutlined,
    UngroupOutlined,
    CloseOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateMetadata } from "../../apis/documentApi";
import Bread from "../../components/Bread/Bread";
import randomString from "../../functions/randomString";
import PermissionModal from "../../components/PermissionModal/PermissionModal";
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
    let [newMetadataId, setNewMetadataId] = useState(null)
    let [comment, setComment] = useState("")
    let metadataKeyNum = 7
    let metadataValueNum = 14
    let metadataButtonNum = 2
    let metadataColonNum = 1
    let newMetaForm = useForm()
    console.log("newMetadata: ", newMetadata)
    useEffect(() => {
        setNewMetadata(document?.versions[0].metadata)
    }, [document])
    // ///////////////////////////////////////////////
    const [inputValue, setInputValue] = useState('');

    // Debounce function
    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            const context = this;
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Debounced setInputValue function
    const setInputValueDebounced = debounce((value) => {
        setInputValue(value);
    }, 2000);

    // Handle input change
    const handleInputChange = (event) => {
        const { value } = event.target;
        setInputValueDebounced(value);
    };
    // ///////////////////////////////////////////////
    async function handleUpdateMetadata(data) {
        console.log("CAUTION: handleUpdateMetadata", data)
        setLoadingUpdateMetadata(true)
        // original function in Page_Upload_Metadata.jsx
        let newForm = new FormData()
        // newForm.append('files', uploadDocument.fileList[0])
        newForm.append("data", JSON.stringify({
            "message": data["message"],
            "metadata": newMetadata
        }))
        let response = await updateMetadata(userStorage.access_token, document_id, newForm)
        let documentResponse = await getDocument(userStorage.access_token, document_id)
        setDocument(documentResponse)
        setNewMetadata(documentResponse.versions[0].metadata)
        setLoadingUpdateMetadata(false)
        setModalOpen(false)
    }
    function resetMetadata() {
        setNewMetadata(document.versions[0].metadata)
    }
    function deleteMetadataPair(index) {
        let newlyMetadataPair = JSON.parse(JSON.stringify(newMetadata))
        newlyMetadataPair.splice(index, 1)
        setNewMetadata(newlyMetadataPair)
    }
    function addMetadata(data) {
        console.log("CAUTION: addMetadata", data)
        setNewMetadata([
            ...newMetadata,
            {
                [data.newKey]: data.newValue
            }
        ])
        newMetaForm.reset()
    }

    function editMetadata(idx, key, value) {
        let newlyEditedMetadata = JSON.parse(JSON.stringify(newMetadata))
        newlyEditedMetadata.splice(idx, 1, {
            [key]: value
        })
        setNewMetadata(newlyEditedMetadata)
    }
    return (
        <>
            <Button onClick={() => { setModalOpen(true) }}>Edit metadata</Button>
            <Modal footer={null} style={{ top: 100 }} title="Edit metadata" open={modalOpen} maskClosable={true} onCancel={() => { setModalOpen(false) }}>
                <form>
                    {newMetadata && newMetadata?.map((item, index) => {
                        return (<Row key={index} style={{ marginTop: 8 }} gutter={[8, 8]}>
                            <Col span={metadataButtonNum}>
                                <Button onClick={() => deleteMetadataPair(index)} type={"text"} shape={"circle"} icon={<CloseOutlined />} />
                            </Col>
                            <Col span={metadataKeyNum}>
                                {/* <Typography.Text>{Object.entries(item)[0][0]}</Typography.Text> */}
                                <Input.TextArea onChange={(e) => editMetadata(index, e.target.value, Object.entries(item)[0][1])} autoSize={{ minRows: 1, maxRows: 4 }} value={Object.entries(item)[0][0]} />
                            </Col>
                            <Col span={metadataColonNum} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                                <Typography.Text>:</Typography.Text>
                            </Col>
                            <Col span={metadataValueNum}>
                                {Object.entries(item)[0][0] == 'Văn bản liên quan'
                                    ? JSON.parse(Object.entries(item)[0][1].replaceAll("'", '"')).map((ite, index, arr) =>
                                        <Input.TextArea style={{ marginBottom: index + 1 == arr.length ? 0 : 8 }} key={index} autoSize={{ minRows: 1, maxRows: 4 }} value={ite} />
                                    )
                                    : <Input.TextArea onChange={(e) => editMetadata(index, Object.entries(item)[0][0], e.target.value)} autoSize={{ minRows: 1, maxRows: 4 }} value={Object.entries(item)[0][1]} />
                                }
                            </Col>
                        </Row>)
                    }
                    )}
                    <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                        <Col span={2}>
                            <Button onClick={newMetaForm.handleSubmit(addMetadata)} shape="circle" icon={<PlusOutlined />} />
                        </Col>
                        <Col span={7}>
                            <Controller name="newKey" control={newMetaForm.control} render={({ field }) => <><Input {...field} placeholder="key" /></>} />
                        </Col>
                        <Col span={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography.Text>:</Typography.Text>
                        </Col>
                        <Col span={14}>
                            <Controller name="newValue" control={newMetaForm.control} render={({ field }) => <><Input {...field} placeholder="value" /></>} />
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} justify={"end"}>
                        <Col md={24}>
                            <Typography.Title level={4}>Add some message</Typography.Title>
                            <Controller name="message" control={newMetaForm.control}
                                render={({ field }) => <>
                                    <Input.TextArea placeholder="enter your message..." {...field} />
                                </>} />

                        </Col>
                    </Row>

                    <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: 'flex-end', columnGap: 8 }}>
                        <Button onClick={() => { resetMetadata() }}>Reset to default</Button>
                        <Button loading={loadingUpdateMetadata} type="primary" onClick={newMetaForm.handleSubmit(handleUpdateMetadata)}>Save</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
const Page_Document_Id = () => {
    let [document, setDocument] = useState(null)
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
        }
    ]
    useEffect(() => {
        async function fetchData() {
            let documentResponse = await getDocument(userStorage.access_token, document_id)
            setDocument(documentResponse)
        }
        fetchData()
    }, [])

    // ///////////////////////////////////////////////////////

    // console.log(watch("example")) // watch input value by passing the name of it
    // ///////////////////////////////////////////////////////
    return (
        <>
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
                            <Col md={24}>
                                <Button style={{ width: "100%" }} type="primary">Lock file</Button>
                            </Col>
                            <Col md={24}>
                                <PermissionModal document={document} modalButton={<Button style={{ width: "100%" }} type="primary">Manage access</Button>} />
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