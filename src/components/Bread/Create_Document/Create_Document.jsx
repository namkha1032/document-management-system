import { useContext, useState, useEffect } from "react";
import ModeThemeContext from "../../../context/ModeThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Table,
    Modal,
    Upload,
    Popconfirm,
    Tabs,
    Input,
    Card,
    Skeleton,
    Steps,
    theme,
    Row,
    Col,
} from "antd"
import {
    ShareAltOutlined,
    PlusOutlined,
    UploadOutlined,
    CheckOutlined,
    DeleteOutlined,
    LoadingOutlined,
    HourglassOutlined
} from '@ant-design/icons';
import UploadDocumentContext from "../../../context/UploadDocumentContext";
import { extractMetadata, saveDocumentToCloud } from "../../../apis/documentApi";
const Create_Document = () => {
    let [modalOpen, setModalOpen] = useState(false)
    let [loadingUpload, setLoadingUpload] = useState(false)
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const antdTheme = theme.useToken()
    const [uploadDocument, dispatchUploadDocument] = useContext(UploadDocumentContext)
    console.log("uploadDocument: ", uploadDocument)
    const [fileList, setFileList] = useState([]);
    let userStorage = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()
    const items = [
        {
            key: 0,
            title: "Upload document"
        },
        {
            key: 1,
            icon: uploadDocument.current == 1 ? <LoadingOutlined /> : null,
            title: "Extract metadata"
        },
        {
            key: 2,
            title: "Save file"
        },
    ]
    const handleChange = (info) => {
        let newFileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        newFileList = newFileList.slice(-2);

        // 2. Read from response and show file link
        newFileList = newFileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });
        console.log("newFileList: ", newFileList)
        setFileList(newFileList);
    };
    const handleAddPair = () => {

    };
    function handleUpdateMetadata(key, value) {

    }
    async function handleSave() {
        setLoadingUpload(true)
        let newForm = new FormData()
        newForm.append('files', uploadDocument.fileList[0])
        newForm.append("data", JSON.stringify({
            "message": "hehehe",
            "metadata": uploadDocument.metadata
        }))
        console.log("newForm: ", newForm)
        let response = await saveDocumentToCloud(userStorage.access_token, newForm)
        console.log("response in handleSave: ", response)
        dispatchUploadDocument({ type: "reset" })
        navigate(`/document/${response.document.uid}`, {
            state: {
                breadState: [
                    { "title": "My documents", "path": `/my-documents` },
                    { "title": Array.isArray(response.versions) ? `${response.versions[0].file_name}` : `${response.versions.file_name}`, "path": `/document/${response.document.uid}` }
                ]

            }
        })
        setLoadingUpload(false)
    }
    async function handleOCR() {
        dispatchUploadDocument({ type: "setStep", payload: 1 })
        let newForm = new FormData()
        newForm.append('pdf_file', uploadDocument.fileList[0])
        let response = await extractMetadata(newForm)
        dispatchUploadDocument({ type: "setResult", payload: response.metadata })
    }
    return (
        <>
            <Modal width={1000} footer={null} style={{ top: 100 }} title="Create new document" open={modalOpen} maskClosable={true} onCancel={() => { setModalOpen(false) }}>
                <Steps current={uploadDocument.current} items={items} style={{ marginBottom: 16 }} />

                {uploadDocument.fileList.length > 0
                    ? <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                        <div md={14} style={{ width: "50%" }}>
                            <iframe src={uploadDocument.fileUrl[0]} style={{ width: "100%", height: 600, border: 0 }}>
                            </iframe>
                        </div>
                        <div style={{ transition: "width 0.3s", overflowX: "hidden", width: uploadDocument.current != 0 ? "50%" : 0 }}>
                            <Card title={uploadDocument.current == 1 ? "Your document is being processed..." : "OCR result"}
                                style={{ height: 600, display: "flex", flexDirection: "column", marginLeft: 16 }}
                                styles={{
                                    header: {
                                        flex: "0 1 auto"
                                    },
                                    body: {
                                        flex: "1 1 auto",
                                        overflowY: "scroll"
                                    }
                                }}
                            >
                                {uploadDocument.current == 1
                                    ? <Skeleton active />
                                    : <>
                                        {uploadDocument?.metadata?.map((item, index) => {
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
                                        <Typography.Title level={4}>Add new metadata</Typography.Title>
                                        {/* <div className="metadata-input metadata-item value-item"> */}
                                        <Row gutter={[8, 8]}>
                                            <Col span={10}>
                                                <Input.TextArea autoSize value={newKey} placeholder='New key' onChange={(e) => setNewKey(e.target.value)} style={{ width: '100%' }} />
                                            </Col>
                                            <Col span={11}>
                                                <Input.TextArea autoSize value={newValue} placeholder='New value' onChange={(e) => setNewValue(e.target.value)} style={{ width: '100%' }} />
                                            </Col>
                                            <Col span={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button icon={<PlusOutlined />}
                                                    onClick={handleAddPair}
                                                />
                                            </Col>
                                        </Row>
                                        {/* </div> */}
                                    </>}
                            </Card>
                        </div>
                    </div>
                    : null}
                {uploadDocument.current == 0 && (
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: 16 }}>
                            <Upload fileList={uploadDocument.fileList} name={"file"} multiple={false}
                                beforeUpload={(file) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        // setPdfFile(reader.result);
                                        dispatchUploadDocument({
                                            type: "setFile", payload: {
                                                fileUrl: [reader.result],
                                                fileList: [file]
                                            }
                                        })
                                    };
                                    reader.readAsDataURL(file);
                                    // dispatchUploadDocument({ type: "addFile", payload: file })
                                    return false
                                }}
                                onRemove={(file) => {
                                    // const index = uploadDocument.fileList.indexOf(file);
                                    // const newFileList = uploadDocument.fileList.slice();
                                    // newFileList.splice(index, 1);
                                    // dispatchUploadDocument({ type: "setFileList", payload: newFileList })
                                    dispatchUploadDocument({
                                        type: "setFile", payload: {
                                            fileUrl: [],
                                            fileList: []
                                        }
                                    })

                                }}
                            >
                                {uploadDocument.fileList.length == 0
                                    ? <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    : null
                                }
                            </Upload>
                        </div>
                        {/* {uploadDocument.fileList.length > 0
                            ? <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button danger>Discard</Button>

                            </div>
                            : null} */}
                    </>
                )}
                <div style={{ display: 'flex', justifyContent: "flex-end", marginTop: 16, columnGap: 16 }}>
                    {uploadDocument.current == 0 && uploadDocument.fileList.length > 0
                        ? <Button type="primary" onClick={() => handleOCR()}>
                            Start OCR
                        </Button>
                        : null}
                    {uploadDocument.current == 2 ?
                        <Button danger onClick={() => { dispatchUploadDocument({ type: "reset" }) }}>Discard</Button>
                        : null}
                    {uploadDocument.current == 2 ?
                        <Button loading={loadingUpload} type="primary" icon={<CheckOutlined />} onClick={() => handleSave()}>
                            Save document
                        </Button>
                        : null}

                </div>
            </Modal >
            <Button onClick={() => { setModalOpen(true) }} type="primary"
                style={{ backgroundColor: uploadDocument.current == 0 ? antdTheme.token.colorPrimary : (uploadDocument.current == 1 ? antdTheme.token.colorWarning : antdTheme.token.colorSuccess) }}
                icon={uploadDocument.current == 0 ? <PlusOutlined /> : (uploadDocument.current == 1 ? <HourglassOutlined /> : <CheckOutlined />)} size={"large"}>
                {uploadDocument.current == 0 ? "New document" : null}
                {uploadDocument.current == 1 ? "Extracting..." : null}
                {uploadDocument.current == 2 ? "Finish" : null}
            </Button>
        </>
    )
}

export default Create_Document