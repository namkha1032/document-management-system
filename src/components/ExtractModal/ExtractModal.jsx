import { useContext, useState, useEffect } from "react";
import ModeThemeContext from "../../context/ModeThemeContext";
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
    HourglassOutlined,
    Loading3QuartersOutlined,
    LikeOutlined
} from '@ant-design/icons';
import UploadDocumentContext from "../../context/UploadDocumentContext";
import { apiExtractMetadata, apiSaveDocumentToCloud, apiUpdateMetadata } from "../../apis/documentApi";
import TagButton from "../TagButton/TagButton";
import FormEditMetadata from "../FormEditMetadata/FormEditMetadata";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ExtractModal = (props) => {
    let index = props.index
    let [modalOpen, setModalOpen] = useState(false)
    let [loadingUpload, setLoadingUpload] = useState(false)
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const antdTheme = theme.useToken()
    const [uploadDocument, dispatchUploadDocument] = useContext(UploadDocumentContext)
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
            icon: uploadDocument[index].current == 1 ? <LoadingOutlined /> : null,
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
        setFileList(newFileList);
    };
    const handleAddPair = () => {

    };
    function editMetadataArray(newMetadataArray) {
        dispatchUploadDocument({ type: "editMetadata", payload: { index: index, metadata: newMetadataArray } })
    }
    async function handleSave() {
        setLoadingUpload(true)
        let newForm = new FormData()
        newForm.append('files', uploadDocument[index].fileList[0])
        newForm.append("data", JSON.stringify({
            "metadata": uploadDocument[index].metadata,
            "message": "hehe"
        }))
        // for (let i = 0; i < 100; i++) {
        //     let response = await apiSaveDocumentToCloud(userStorage.access_token, newForm)
        // }
        let response = await apiSaveDocumentToCloud(userStorage.access_token, newForm)
        console.log("responseadddoc", response)
        navigate(`/document/${response.document.uid}`, {
            state: {
                breadState: [
                    { "title": "My documents", "path": `/my-documents` },
                    { "title": response.versions.file_name != "" ? `${response.versions.file_name}` : `${response.document.uid}`, "path": `/document/${response.document.uid}` }
                    // { "title": Array.isArray(response.versions) ? `${response.versions[0].file_name}` : `${response.versions.file_name}`, "path": `/document/${response.document.uid}` }
                ]
            }
        })
        dispatchUploadDocument({ type: "removeItem", payload: { index: index } })
        setLoadingUpload(false)
    }
    async function handleSaveUpdate() {
        setLoadingUpload(true)
        let newForm = new FormData()
        newForm.append('files', uploadDocument[index].fileList[0])
        newForm.append("data", JSON.stringify({
            "metadata": uploadDocument[index].metadata,
            "message": "Update new file"
        }))
        // for (let i = 0; i < 100; i++) {
        //     let response = await apiSaveDocumentToCloud(userStorage.access_token, newForm)
        // }
        let response = await apiUpdateMetadata(userStorage.access_token, uploadDocument[index].uploadType, newForm)
        console.log("responsesavedoc", response)
        dispatchUploadDocument({ type: "removeItem", payload: { index: index } })
        setLoadingUpload(false)
        navigate(`/document/${uploadDocument[index].uploadType}`, {
            state: {
                reloadFile: true
            }
        })
        // window.location.reload()
    }
    async function handleOCR() {
        dispatchUploadDocument({ type: "setStep", payload: { index: index, current: 1 } })
        let newForm = new FormData()
        newForm.append('pdf_file', uploadDocument[index].fileList[0])
        let response = await apiExtractMetadata(newForm)
        dispatchUploadDocument({ type: "setResult", payload: { index: index, metadata: response.metadata } })
    }
    return (
        <>
            {/* <ToastContainer /> */}
            <Modal
                width={"60%"}
                // width={1200}
                footer={null} style={{ top: 100 }} title={uploadDocument[index].uploadType === "create" ? "Create new document" : "Update new file version"} open={uploadDocument[index].modalOpen} maskClosable={true}
                onCancel={() => {
                    if (uploadDocument[index].fileList.length == 0) {
                        dispatchUploadDocument({ type: "removeItem", payload: { index: index } })
                    }
                    else {
                        dispatchUploadDocument({ type: "closeModal", payload: { index: index } })
                    }
                }}
            >
                <Steps current={uploadDocument[index].current} items={items} style={{ marginBottom: 16 }} />

                {uploadDocument[index].fileList.length > 0
                    ? <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                        <div md={14} style={{ width: "50%" }}>
                            <iframe src={uploadDocument[index].fileUrl[0]} style={{ width: "100%", height: 600, border: 0 }}>
                            </iframe>
                        </div>
                        <div style={{ transition: "width 0.3s", overflowX: "hidden", width: uploadDocument[index].current != 0 ? "50%" : 0 }}>
                            <Card title={uploadDocument[index].current == 1 ? "Your document is being processed..." : "OCR result"}
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
                                {uploadDocument[index].current == 1
                                    ? <Skeleton active />
                                    : <>
                                        <FormEditMetadata type="edit" newMetadata={uploadDocument[index]?.metadata} setNewMetadata={editMetadataArray} />
                                        {/* {uploadDocument[index]?.metadata?.map((item, index) => {
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
                                        )} */}

                                        {/* </div> */}
                                    </>}
                            </Card>
                        </div>
                    </div>
                    : null}
                {uploadDocument[index].current == 0 && (
                    <>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: 16 }}>
                            <Upload fileList={uploadDocument[index].fileList} name={"file"} multiple={false}
                                beforeUpload={(file) => {
                                    console.log("upload file", file)
                                    if (file.type == "application/pdf") {
                                        if (file.size < 20971520) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                // setPdfFile(reader.result);
                                                dispatchUploadDocument({
                                                    type: "setFile", payload: {
                                                        index: index,
                                                        fileUrl: [reader.result],
                                                        fileList: [file]
                                                    }
                                                })
                                            };
                                            reader.readAsDataURL(file);
                                            // dispatchUploadDocument({ type: "addFile", payload: file })
                                            return false
                                        }
                                        else {
                                            toast.error("File's size < 20MB please", {
                                                theme: "colored"
                                            })
                                        }
                                    }
                                    else {
                                        toast.error('Please upload a PDF file', {
                                            theme: "colored"
                                        })
                                    }
                                }}
                                onRemove={(file) => {
                                    // const index = uploadDocument[index].fileList.indexOf(file);
                                    // const newFileList = uploadDocument[index].fileList.slice();
                                    // newFileList.splice(index, 1);
                                    // dispatchUploadDocument({ type: "setFileList", payload: newFileList })
                                    dispatchUploadDocument({
                                        type: "setFile", payload: {
                                            index: index,
                                            fileUrl: [],
                                            fileList: []
                                        }
                                    })

                                }}
                            >
                                {uploadDocument[index].fileList.length == 0
                                    ? <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    : null
                                }
                            </Upload>
                        </div>
                        {/* {uploadDocument[index].fileList.length > 0
                            ? <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button danger>Discard</Button>

                            </div>
                            : null} */}
                    </>
                )}
                <div style={{ display: 'flex', justifyContent: "flex-end", marginTop: 16, columnGap: 16 }}>
                    {uploadDocument[index].current == 0 && uploadDocument[index].fileList.length > 0
                        ? <Button type="primary" onClick={() => handleOCR()}>
                            Start OCR
                        </Button>
                        : null}
                    {uploadDocument[index].current == 2 ?
                        <Button danger onClick={() => {
                            dispatchUploadDocument({
                                type: "setFile", payload: {
                                    index: index,
                                    fileUrl: [],
                                    fileList: []
                                }
                            })
                            dispatchUploadDocument({
                                type: "setStep", payload: {
                                    index: index,
                                    current: 0,
                                }
                            })
                        }}>Discard</Button>
                        : null}
                    {uploadDocument[index].current == 2 ?
                        <Button loading={loadingUpload} type="primary" icon={<CheckOutlined />} onClick={() => {
                            if (uploadDocument[index].uploadType == "create") {
                                handleSave()
                            }
                            else {
                                // console.log("hahahaha", uploadDocument[index].uploadType)
                                handleSaveUpdate()
                            }
                        }}>
                            Save document
                        </Button>
                        : null}

                </div>
            </Modal >
            {/* <Button onClick={() => { setModalOpen(true) }} type="primary"
                style={{ backgroundColor: uploadDocument[index].current == 0 ? antdTheme.token.colorPrimary : (uploadDocument[index].current == 1 ? antdTheme.token.colorWarning : antdTheme.token.colorSuccess) }}
                icon={uploadDocument[index].current == 0 ? <PlusOutlined /> : (uploadDocument[index].current == 1 ? <HourglassOutlined /> : <CheckOutlined />)} size={"large"}>
                {uploadDocument[index].current == 0 ? "New document" : null}
                {uploadDocument[index].current == 1 ? "Extracting..." : null}
                {uploadDocument[index].current == 2 ? "Finish" : null}
            </Button> */}
            <TagButton handleClick={() => { dispatchUploadDocument({ type: "openModal", payload: { index: index } }) }}
                icon={uploadDocument[index].current == 0 ? <LikeOutlined /> : (uploadDocument[index].current == 1 ? <Loading3QuartersOutlined spin /> : <CheckOutlined />)}
                color={uploadDocument[index].current == 0 ? "blue" : (uploadDocument[index].current == 1 ? "gold" : "green")}
                width={uploadDocument[index]?.fileList.length > 0 ? 100 : 0}
                height={uploadDocument[index]?.fileList.length > 0 ? 24 : 0}
                borderWidth={uploadDocument[index]?.fileList.length > 0 ? 1 : 0}
                borderRadius={100} fontSize={12} columnGap={0}
                marginLeft={uploadDocument[index]?.fileList.length > 0 ? 8 : 0}
            >
                {uploadDocument[index].current == 0 ? "Ready" : null}
                {uploadDocument[index].current == 1 ? "Extracting" : null}
                {uploadDocument[index].current == 2 ? "Finished" : null}
            </TagButton>
        </>
    )
}

export default ExtractModal