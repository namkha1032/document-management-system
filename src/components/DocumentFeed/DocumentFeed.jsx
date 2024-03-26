import { useContext, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import {
    Typography,
    Row,
    Col,
    Card,
    theme,
    Table,
    Avatar,
    Button,
    Skeleton,
    Pagination,
    Image,
    Checkbox
} from "antd"
import {
    DownloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    PlusOutlined,
    CloseOutlined,
    LinkOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { MdVpnKey } from "react-icons/md";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Document, Page, pdfjs } from "react-pdf"
import GridListContext from "../../context/GridListContext"
import CardSelectedNode from "../../pages/Page_Ontology_Url/CardSelectedNode/CardSelectedNode";
import axios from "axios";
import { convertToPng } from "../../apis/documentApi";
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.js',
//     import.meta.url,
// ).toString();
// async function convertToPng(pdfUrl) {
//     try {
//         // Fetch the PDF file from the predefined URL using Axios
//         const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

//         // Use pdf.js to parse the PDF
//         const pdf = await window.pdfjsLib.getDocument(response.data).promise;

//         // Get the first page
//         const page = await pdf.getPage(1);

//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

//         canvas.width = viewport.width;
//         canvas.height = viewport.height;

//         const renderContext = {
//             canvasContext: context,
//             viewport: viewport
//         };

//         await page.render(renderContext).promise;

//         // Convert canvas content to PNG
//         const pngDataUrl = canvas.toDataURL('image/png');
//         console.log(pngDataUrl);
//         // setPngUrl(pngDataUrl)
//         return pngDataUrl
//         // Use pngDataUrl for your purpose, e.g., displaying it or downloading it
//     } catch (error) {
//         console.error('There was a problem fetching or processing the PDF:', error);
//     }
// };
const PdfToPngConverter = () => {
    const pdfUrl = '/file/sample.pdf'; // Hardcoded PDF URL
    let [pngUrl, setPngUrl] = useState(null)

    useEffect(() => {
        async function fetchData() {
            let response = await convertToPng(pdfUrl)
            setPngUrl(response)
        }
        fetchData()
    }, [])
    return (
        <div>
            <button onClick={convertToPng}>Convert to PNG</button>
            <Image src={pngUrl} />
        </div>
    );
}
const DocumentFeed = (props) => {
    const { state } = useLocation();
    let breadSelectedDoc = state?.breadSelectedDoc
    let originTitle = props.originTitle
    let originPath = props.originPath
    let documentResult = props.documentResult
    let dispatchDocumentResult = props.dispatchDocumentResult
    let getDocumentsApi = props.getDocumentsApi
    let userStorage = JSON.parse(localStorage.getItem("user"))
    let [gridList, dispatchGridList] = useContext(GridListContext)
    let [selectedDoc, setSelectedDoc] = useState([])
    let [selectedKey, setSelectedKey] = useState([])
    let antdTheme = theme.useToken()
    const navigate = useNavigate()
    // fetch("http://localhost:3000/file/sample.pdf")
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         console.log("response pdf: ", response)
    //         console.log("response pdf arrayBuffer: ", response.arrayBuffer())
    //         return response.arrayBuffer();
    //     })
    useEffect(() => {
        // console.log("feedDocuments: ", documents)
        // let documentObj = {
        //     file_name: "filename.pdf",
        //     document_title: "Nghị quyết 19/NQ-CP",
        //     document_size: "1MB",
        //     document_owner: {
        //         owner_name: "Nam Kha",
        //         owner_avatar: "https://styles.redditmedia.com/t5_53zrzx/styles/profileIcon_s4vsse5n5nq71.jpg?width=256&height=256&frame=1&auto=webp&crop=256:256,smart&s=e74d89cd945ec619fe1956b52989f6cedfc5fdf5"
        //     },
        //     document_created: '2024-02-03T13:47:56.668Z',
        //     document_updated: '2024-02-03T13:47:56.668Z',
        //     document_pdf: '/file/sample.pdf',
        // }
        // setDocumentResult(response)
        if (breadSelectedDoc) {
            setSelectedDoc([breadSelectedDoc])
            setSelectedKey([breadSelectedDoc.uid])
        }
    }, [])
    function ctrlSetSelectedDocuments(e, item) {
        e.stopPropagation()
        let findDoc = selectedKey.find((key) => key == item.uid)
        if (e.ctrlKey) {
            if (findDoc) {
                setSelectedDoc(selectedDoc.filter((seDoc) => seDoc.uid !== item.uid))
                setSelectedKey(selectedKey.filter((seKey) => seKey !== item.uid))
            }
            else {
                setSelectedDoc([...selectedDoc, item])
                setSelectedKey([...selectedKey, item.uid])
            }
        }
        else {
            if (findDoc && selectedDoc.length == 1) {
                setSelectedDoc([])
                setSelectedKey([])
            }
            else {
                setSelectedDoc([item])
                setSelectedKey([item.uid])
            }
        }
    }
    let documentColumns = [
        {
            title: "Name",
            render: (obj) => {
                return (
                    <div onClick={(e) => ctrlSetSelectedDocuments(e, obj)} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <FontAwesomeIcon icon={icon({ name: 'file-pdf', family: 'classic', style: 'solid' })} style={{ color: "#e2574c" }} />
                        <Typography.Text>{obj.versions[0].file_name ? obj.versions[0].file_name : obj.uid}</Typography.Text>
                    </div>
                )
            }
        },
        // {
        //     title: "Size",
        //     render: (obj) => {
        //         return (
        //             <Typography.Text>{"1 MB"}</Typography.Text>
        //         )
        //     }
        // },
        {
            title: "Owner",
            render: (obj) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <Avatar src={`/file/avatar.png`} />
                        <Typography.Text>{obj.owner.first_name + " " + obj.owner.last_name}</Typography.Text>
                    </div>
                )
            }
        },
        {
            title: "Created date",
            render: (obj) => {
                return (
                    <Typography.Text>{new Date(obj.created_date).toLocaleString()}</Typography.Text>
                )
            }
        },
        {
            title: "Last updated",
            render: (obj) => {
                return (
                    <Typography.Text>{new Date(obj.updated_date).toLocaleDateString()}</Typography.Text>
                )
            }
        }
    ]
    async function changePagination(newPage, newPageSize) {
        setSelectedDoc([])
        setSelectedKey([])
        dispatchDocumentResult({
            type: "pagination", payload: {
                newPage: newPage,
                newPageSize: newPageSize
            }
        })
        dispatchDocumentResult({ type: "loading", payload: true })
        let response = await getDocumentsApi(userStorage.access_token, newPage, newPageSize)
        dispatchDocumentResult({
            type: "set",
            payload: {
                ...documentResult,
                documents: response.documents,
                current: response.current_page,
                pageSize: response.page_size,
                total: response.total_items,
                totalPage: response.total_pages
            }
        })
        dispatchDocumentResult({ type: "loading", payload: false })
    }
    function setSelectedDocuments(e, item) {
        if (e.target.checked) {
            setSelectedDoc([
                ...selectedDoc,
                item
            ])
            setSelectedKey([
                ...selectedKey,
                item.uid
            ])
        }
        else {
            setSelectedDoc(selectedDoc.filter((seDoc) => seDoc.uid !== item.uid))
            setSelectedKey(selectedKey.filter((seKey) => seKey !== item.uid))
        }
    }
    return (
        documentResult.documents !== null
            ?
            <div style={{ overflowX: "hidden", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "40px", display: "flex", justifyContent: "space-between", marginBottom: 16, marginTop: 1, flex: "0 1 auto", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Checkbox checked={selectedDoc.length == documentResult.documents.length}
                            indeterminate={selectedDoc.length > 0 && selectedDoc.length < documentResult.documents.length}
                            style={{ fontWeight: 500, fontSize: 16 }}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedKey(documentResult.documents.map((item, index) => item.uid))
                                    setSelectedDoc(documentResult.documents)
                                }
                                else {
                                    setSelectedKey([])
                                    setSelectedDoc([])
                                }
                            }}>Select all</Checkbox>
                        <div style={{
                            border: selectedDoc.length > 0 ? `1px solid ${antdTheme.token.colorBorder}` : `0px solid white`,
                            overflow: "hidden", transition: "width 0.3s",
                            width: selectedDoc.length > 0 ? 300 : 0,
                            backgroundColor: antdTheme.token.colorBgContainer, borderRadius: 100, display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Button size="large" shape="circle" type="text" icon={<CloseOutlined />} onClick={() => {
                                    setSelectedDoc([])
                                    setSelectedKey([])
                                }} />
                                <Typography.Text ellipsis style={{ fontSize: 16, fontWeight: 500 }}>{selectedDoc.length} selected</Typography.Text>
                            </div>
                            <div style={{ display: 'flex', columnGap: 8, alignItems: 'center' }}>
                                <Button size="large" shape="circle" type="text" icon={<DownloadOutlined />} />
                                <Button size="large" shape="circle" type="text" icon={<DeleteOutlined />} />
                                <Button size="large" shape="circle" type="text" icon={<LinkOutlined rotate={45} />} />
                            </div>
                        </div>
                    </div>
                    <Pagination
                        pageSizeOptions={[12, 24, 36, 48]}
                        showQuickJumper showSizeChanger
                        onChange={(newPage, newPageSize) => changePagination(newPage, newPageSize)} current={documentResult.current} total={documentResult.total} pageSize={documentResult.pageSize} />
                </div>
                <>
                    <div style={{ flex: "1 1 auto", width: "100%", height: "100%", display: "flex", columnGap: selectedDoc.length == 1 ? 16 : 0, justifyContent: "space-between" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: selectedDoc.length == 1 ? "70%" : "100%", transition: "width 0.3s" }}>
                            <div className="sumGrid" style={{ display: "flex", width: "100%", height: "100%" }}>
                                <div style={{
                                    display: "flex", width: gridList == "grid" ? "100%" : 0, transition: "width 0.3s",
                                    overflowX: gridList == "grid" ? "visible" : "hidden"
                                }}>
                                    <div style={{ flex: 1, position: "relative" }}>
                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            overflowY: "scroll",
                                            overflowX: "hidden",
                                            marginRight: -8,
                                            paddingRight: 8
                                        }}>
                                            {gridList == "grid" ?
                                                <Row gutter={selectedDoc.length == 1 ? [8, 8] : [16, 16]} style={{ transition: "row-gap 0.3s" }}>
                                                    {
                                                        documentResult.loading == false
                                                            ? documentResult.documents.map((item, index) =>
                                                                <Col
                                                                    // md={selectedDoc.length == 1 ? 6 : 4}
                                                                    md={4}
                                                                    key={index} style={{ transition: "width 0.3s, padding 0.3s" }}>
                                                                    <Card
                                                                        onDoubleClick={() => {
                                                                            navigate(`/document/${item.uid}`, {
                                                                                state: {
                                                                                    breadState: [
                                                                                        { "title": originTitle, "path": `/${originPath}` },
                                                                                        { "title": `${item.versions[0].file_name ? item.versions[0].file_name : item.uid}`, "path": `/document/${item.uid}` }
                                                                                    ]

                                                                                }
                                                                            })
                                                                        }}
                                                                        style={{
                                                                            transition: "width 0.3s, height 0.3s",
                                                                            borderColor: antdTheme.token.colorBorder,
                                                                            backgroundColor: selectedDoc.find((seDoc) => seDoc.uid == item?.uid) ? antdTheme.token.controlItemBgActiveHover : antdTheme.token.colorBgContainer
                                                                        }}

                                                                        hoverable styles={{
                                                                            body: {
                                                                                paddingTop: 16,
                                                                                paddingLeft: 16,
                                                                                paddingBottom: 16,
                                                                                paddingRight: 16
                                                                            }
                                                                        }}>
                                                                        <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 8 }}>
                                                                            <FontAwesomeIcon icon={icon({ name: 'file-pdf', family: 'classic', style: 'solid' })} style={{ color: "#e2574c" }} />
                                                                            <Typography.Title onClick={(e) => ctrlSetSelectedDocuments(e, item)} ellipsis={{ rows: 1 }} level={5} style={{ margin: 0 }}>{item.versions[0].file_name ? item.versions[0].file_name : item.uid}</Typography.Title>
                                                                            <Checkbox checked={selectedDoc.find((seDoc) => seDoc.uid == item.uid)} onChange={(e) => { setSelectedDocuments(e, item) }} />
                                                                        </div>
                                                                        <div onClick={(e) => ctrlSetSelectedDocuments(e, item)} className="pdfBorder" style={{ transition: "height 0.3s", height: selectedDoc.length == 1 ? 100 : 150, overflow: "hidden", display: "flex", border: `1px solid ${antdTheme.token.colorBorder}`, borderRadius: 8 }}>
                                                                            <Image src={item.versions[0].url.length > 0
                                                                                ? `//image.thum.io/get/pdfSource/page/1/${item.versions[0].url}`
                                                                                : "//image.thum.io/get/pdfSource/page/1/https://pdfobject.com/pdf/sample.pdf"} preview={false} />
                                                                        </div>
                                                                    </Card>
                                                                </Col>
                                                            )
                                                            : Array.from('X'.repeat(24)).map((item, index) =>
                                                                <Col md={4} key={index} style={{ height: 216 }}>
                                                                    <Skeleton.Button active block className="mySkele" />
                                                                </Col>)
                                                    }
                                                </Row>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    display: "flex", width: gridList == "list" ? "100%" : 0, transition: "width 0.3s",
                                    overflowX: gridList == "list" ? "visible" : "hidden"
                                }}>
                                    <div style={{ flex: 1, position: "relative" }}>
                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            overflowY: "scroll",
                                            marginRight: -8,
                                            paddingRight: 8
                                        }}>
                                            {gridList == "list" ? <Table
                                                columns={documentColumns}
                                                rowKey={(record) => record.uid}
                                                dataSource={documentResult.documents}
                                                style={{
                                                    borderRadius: 8, cursor: "pointer",
                                                }}
                                                pagination={false}
                                                loading={documentResult.loading}
                                                rowSelection={{
                                                    hideSelectAll: true,
                                                    type: "checkbox",
                                                    onChange: (selectedRowKeys, selectedRows) => {
                                                        setSelectedDoc(selectedRows)
                                                        setSelectedKey(selectedRowKeys)
                                                    },
                                                    selectedRowKeys: selectedKey
                                                }}
                                            /> : null}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <Card
                            title={selectedDoc[0]?.uid}
                            className="selectCard"
                            extra={
                                <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                                    <Button type={"primary"} onClick={() => {
                                        navigate(`/document/${selectedDoc[0]?.uid}`, {
                                            state: {
                                                breadState: [
                                                    { "title": originTitle, "path": `/${originPath}` },
                                                    { "title": `${selectedDoc[0]?.versions[0].file_name ? selectedDoc[0]?.versions[0].file_name : selectedDoc[0]?.uid}`, "path": `/document/${selectedDoc[0]?.uid}` }
                                                ]

                                            }
                                        })
                                    }} icon={<EyeOutlined />}>View</Button>
                                    <Button type={"text"} icon={<CloseOutlined />} onClick={() => {
                                        setSelectedDoc([])
                                        setSelectedKey([])
                                    }} />

                                </div>
                            }
                            style={{
                                display: "flex", flexDirection: "column", height: "100%",
                                width: selectedDoc.length == 1 ? "30%" : 0, transition: "width 0.3s, border-width 0.3s",
                                borderWidth: selectedDoc.length == 1 ? "1px" : "0px",
                                borderColor: antdTheme.token.colorBorder
                            }}
                            styles={{
                                header: {
                                    flex: "0 1 auto"
                                },
                                body: {
                                    flex: "1 1 auto",
                                    display: 'flex',
                                    flexDirection: "column"
                                }
                            }}
                        >
                            <div style={{ flex: 1, position: "relative" }}>
                                <div
                                    id={"cardSelectedDoc"}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        overflowY: "scroll"
                                    }}>
                                    <div style={{ height: 300, overflow: "hidden", display: "flex", border: `1px solid ${antdTheme.token.colorBorder}`, borderRadius: 8 }}>
                                        <Image src={selectedDoc[0]?.versions[0].url.length > 0
                                            ? `//image.thum.io/get/pdfSource/page/1/${selectedDoc[0]?.versions[0].url}`
                                            : "//image.thum.io/get/pdfSource/page/1/https://pdfobject.com/pdf/sample.pdf"} />
                                    </div>
                                    <Typography.Title ellipsis level={4}>Who has access</Typography.Title>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Avatar.Group size={48}>
                                            <Avatar src={`/file/giga1.png`} />
                                            <Avatar src={`/file/giga2.png`} />
                                            <Avatar src={`/file/giga3.png`} />
                                            <Avatar src={`/file/giga4.png`} />
                                        </Avatar.Group>
                                        <Button icon={<MdVpnKey />} style={{ display: "flex", alignItems: "center", height: 48, fontSize: 16, borderColor: antdTheme.token.colorText, color: antdTheme.token.colorText }}>Manage access</Button>
                                    </div>
                                    <Typography.Title ellipsis level={4}>Owner</Typography.Title>
                                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", columnGap: 8 }}>
                                        <Avatar size={48} src={`/file/giga1.png`} />
                                        <Typography.Text style={{ fontSize: 24 }} ellipsis>{`${selectedDoc[0]?.owner.first_name} ${selectedDoc[0]?.owner.last_name}`}</Typography.Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </>
            </div >
            :
            <Skeleton active />
    )

}

export default DocumentFeed