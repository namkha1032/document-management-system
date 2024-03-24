import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
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
    CloseOutlined
} from '@ant-design/icons';
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
    console.log("documentResult", documentResult)
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
    }, [])
    let documentColumns = [
        {
            title: "Name",
            render: (obj) => {
                return (
                    <div onClick={() => {
                        // navigate(`/document/${obj.uid}`, {
                        //     state: {
                        //         breadState: [
                        //             { "title": originTitle, "path": `/${originPath}` },
                        //             { "title": `${obj.versions[0].file_name ? obj.versions[0].file_name : obj.uid}`, "path": `/document/${obj.uid}` }
                        //         ]

                        //     }
                        // })
                        setSelectedDoc([obj])
                        setSelectedKey([obj.uid])
                    }} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
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
        dispatchDocumentResult({ type: "pagination", payload: newPage })
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
                {/* <PdfToPngConverter /> */}
                {/* <img src={convertToPng("/file/sample.pdf")} /> */}
                {/* <img src="//image.thum.io/get/https://digital-document-ms.s3.ap-southeast-1.amazonaws.com/nobita/documents/trung.pdf_20240324_182344" /> */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, flex: "0 1 auto" }}>
                    <Pagination
                        pageSizeOptions={[12, 24, 36, 48]}
                        showQuickJumper showSizeChanger
                        onChange={(newPage, newPageSize) => changePagination(newPage, newPageSize)} current={documentResult.current} total={documentResult.total} pageSize={documentResult.pageSize} />
                </div>
                <>
                    <div style={{ flex: "1 1 auto", width: "100%", height: "100%", display: "flex", columnGap: selectedDoc.length == 1 ? 16 : 0, justifyContent: "space-between" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: selectedDoc.length == 1 ? "70%" : "100%", transition: "width 0.5s" }}>
                            <div style={{ flex: 1, position: "relative" }}>
                                {gridList == "grid"
                                    ?
                                    <>
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
                                            <Row style={{
                                                // minHeight: "fit-content",
                                            }} gutter={[16, 16]}>
                                                {documentResult.loading == false
                                                    ? documentResult.documents.map((item, index) =>
                                                        <Col md={selectedDoc.length == 1 ? 6 : 4} key={index} style={{ transition: "width 0.5s" }}>
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
                                                                style={{ transition: "width 0.5s", backgroundColor: selectedDoc.find((seDoc) => seDoc.uid == item?.uid) ? antdTheme.token.controlItemBgActiveHover : antdTheme.token.colorBgContainer }}

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
                                                                    <Typography.Title onClick={() => {
                                                                        setSelectedDoc([item])
                                                                        setSelectedKey([item.uid])
                                                                    }} ellipsis={{ rows: 1 }} level={5} style={{ margin: 0 }}>{item.versions[0].file_name ? item.versions[0].file_name : item.uid}</Typography.Title>
                                                                    <Checkbox checked={selectedDoc.find((seDoc) => seDoc.uid == item.uid)} onChange={(e) => { setSelectedDocuments(e, item) }} />
                                                                </div>
                                                                <div onClick={() => {
                                                                    setSelectedDoc([item])
                                                                    setSelectedKey([item.uid])
                                                                }} className="pdfBorder" style={{ height: 150, overflow: "hidden", display: "flex", border: `1px solid ${antdTheme.token.colorBorder}`, borderRadius: 8 }}>
                                                                    {/* <Document file={item.versions[0].url}>
                                                        <Page
                                                            width={250}
                                                            pageNumber={1} />
                                                    </Document> */}
                                                                    {/* <div style={{ width: 260, height: 200, overflow: "hidden" }}> */}
                                                                    {/* <iframe src={`${item.versions[0].url ? item.versions[0].url : "/file/sample.pdf"}`}
                                                            style={{
                                                                // width: "100%",
                                                                // height: "217px",
                                                                border: 0,
                                                                position: "relative",
                                                                zIndex: 1
                                                            }}
                                                        ></iframe> */}
                                                                    <Image src={item.versions[0].url.length > 0
                                                                        ? `//image.thum.io/get/pdfSource/page/1/${item.versions[0].url}`
                                                                        : "//image.thum.io/get/pdfSource/page/1/https://pdfobject.com/pdf/sample.pdf"} preview={false} />

                                                                    {/* </div> */}
                                                                </div>
                                                                {/* <div style={{ width: 260, height: 200, overflow: "hidden" }}>
                                                    <iframe id="pdfThumbnail" src="/file/sample.pdf#view=fitH&toolbar=0"
                                                        // width={"100%"} height={"100%"} style={{ overflow: "hidden" }}
                                                        style={{
                                                            width: "276px",
                                                            height: "217px",
                                                            border: 0,
                                                            overflow: "scroll"
                                                        }}
                                                    ></iframe>
                                                </div> */}
                                                            </Card>
                                                        </Col>
                                                    )
                                                    : Array.from('X'.repeat(24)).map((item, index) =>
                                                        <Col md={4} key={index}>
                                                            <Card loading />
                                                        </Col>)
                                                }
                                            </Row>
                                        </div>
                                    </>
                                    : <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        overflowY: "scroll",
                                        marginRight: -8,
                                        paddingRight: 8
                                    }}>
                                        <Table
                                            columns={documentColumns}
                                            rowKey={(record) => record.uid}
                                            dataSource={documentResult.documents}
                                            style={{
                                                borderRadius: 8, cursor: "pointer",
                                            }}
                                            pagination={false}
                                            loading={documentResult.loading}
                                            rowSelection={{
                                                type: "checkbox",
                                                onChange: (selectedRowKeys, selectedRows) => {
                                                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                                                    setSelectedDoc(selectedRows)
                                                    setSelectedKey(selectedRowKeys)
                                                },
                                                selectedRowKeys: selectedKey
                                            }}
                                        // loading={searchResult.loading}
                                        // pagination={{
                                        //     ...searchResult.pagination,
                                        //     position: ['bottomCenter']
                                        // }}
                                        // pagination={false}
                                        // onChange={handleTableChange}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                        <Card
                            title={selectedDoc[0]?.uid}
                            className="selectCard"
                            extra={selectedDoc.length == 1 ? <Button type={"text"} icon={<CloseOutlined />} onClick={() => {
                                setSelectedDoc([])
                                setSelectedKey([])
                            }} /> : null}
                            style={{ height: "100%", width: selectedDoc.length == 1 ? "30%" : 0, transition: "width 0.5s, border-width 0.5s", borderWidth: selectedDoc.length == 1 ? "1px" : "0px" }}
                        >
                        </Card>
                    </div>
                </>
            </div >
            :
            <Skeleton active />
    )

}

export default DocumentFeed