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
    Checkbox,
    Empty,
    Tooltip,
    Modal
} from "antd"
import {
    DownloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    PlusOutlined,
    CloseOutlined,
    LinkOutlined,
    EyeOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import { MdVpnKey, MdOutlineDeleteForever, MdOutlineSettingsBackupRestore } from "react-icons/md";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import GridListContext from "../../context/GridListContext"
import CardSelectedDoc from "./CardSelectedDoc/CardSelectedDoc";
import { apiRestoreDocument, apiDeleteForever } from "../../apis/documentApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    let [modalRestore, setModalRestore] = useState(false)
    let [modalDeleteForever, setModalDeleteForever] = useState(false)
    let [loadingRestore, setLoadingRestore] = useState(false)
    let [loadingDeleteForever, setLoadingDeleteForever] = useState(false)
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
            let findDoc = documentResult?.documents?.find((doc, idx) => doc.uid == breadSelectedDoc.uid)
            console.log("findDoc", findDoc)
            if (findDoc) {
                if (selectedDoc.length == 0) {
                    setSelectedDoc([breadSelectedDoc])
                    setSelectedKey([breadSelectedDoc.uid])
                }
            }
            else {
                setSelectedDoc([])
                setSelectedKey([])
            }
        }
    }, [documentResult])
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
                    <Typography.Text>{new Date(obj.updated_date).toLocaleString()}</Typography.Text>
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
    async function handleRestoreDocument() {
        setLoadingRestore(true)
        let documentPromise = selectedDoc.map(async (doc, idx) => {
            await apiRestoreDocument(doc.uid)
        })
        await Promise.all(documentPromise)
        dispatchDocumentResult({
            type: "set", payload: {
                ...documentResult,
                documents: documentResult.documents.filter((olddoc, idx2) => {
                    for (let i = 0; i < selectedDoc.length; i++) {
                        if (selectedDoc[i].uid === olddoc.uid) {
                            return false
                        }
                    }
                    return true
                })
            }
        })
        toast.success('Document has been restored successfully', {
            theme: "colored"
        })
        setSelectedDoc([])
        setSelectedKey([])
        setModalRestore(false)
        setLoadingRestore(false)
    }
    async function handleDeleteForever() {
        setLoadingDeleteForever(true)
        let documentPromise = selectedDoc.map(async (doc, idx) => {
            await apiDeleteForever(doc.uid)
        })
        await Promise.all(documentPromise)
        dispatchDocumentResult({
            type: "set", payload: {
                ...documentResult,
                documents: documentResult.documents.filter((olddoc, idx2) => {
                    for (let i = 0; i < selectedDoc.length; i++) {
                        if (selectedDoc[i].uid === olddoc.uid) {
                            return false
                        }
                    }
                    return true
                })
            }
        })
        toast.success('Document has been deleted forever successfully', {
            theme: "colored"
        })
        setSelectedDoc([])
        setSelectedKey([])
        setModalDeleteForever(false)
        setLoadingDeleteForever(false)
    }
    return (
        documentResult.documents !== null
            ?
            (documentResult?.documents?.length > 0
                ? <>
                    <ToastContainer />
                    <Modal title={
                        <div style={{ display: 'flex', alignItems: "center", columnGap: 8 }}>
                            <ExclamationCircleFilled style={{ fontSize: 22 }} />
                            <Typography.Title level={4} style={{ margin: 0 }}>Restore document</Typography.Title>
                        </div>} open={modalRestore} maskClosable={true} onCancel={() => { setModalRestore(false) }}
                        onOk={() => { handleRestoreDocument() }}
                        cancelText="No"
                        okText="Yes"
                        centered
                        confirmLoading={loadingRestore}
                    >
                        <Typography.Text>{`Are you sure you want to restore ${selectedDoc?.length == 1 ? "this" : `these ${selectedDoc?.length}`} document${selectedDoc?.length == 1 ? "" : "s"}?`}</Typography.Text>
                    </Modal>
                    <Modal title={
                        <div style={{ display: 'flex', alignItems: "center", columnGap: 8 }}>
                            <ExclamationCircleFilled style={{ color: antdTheme.token.colorError, fontSize: 22 }} />
                            <Typography.Title level={4} style={{ margin: 0 }}>Delete forever</Typography.Title>
                        </div>} open={modalDeleteForever} maskClosable={true} onCancel={() => { setModalDeleteForever(false) }}
                        onOk={() => { handleDeleteForever() }}
                        cancelText="No"
                        okText="Yes"
                        centered
                        confirmLoading={loadingDeleteForever}
                    >
                        <Typography.Text>{`Are you sure you want to delete ${selectedDoc?.length == 1 ? "this" : `these ${selectedDoc?.length}`} document${selectedDoc?.length == 1 ? "" : "s"} forever?`}</Typography.Text>
                    </Modal>
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
                                    width: selectedDoc.length > 0 ? (originPath === "trash" ? 250 : 300) : 0,
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
                                        {originPath !== "trash" ?
                                            <>
                                                <Button size="large" shape="circle" type="text" icon={<DownloadOutlined />} />
                                                <Button size="large" shape="circle" type="text" icon={<DeleteOutlined />} />
                                                <Button size="large" shape="circle" type="text" icon={<LinkOutlined rotate={45} />} />
                                            </>
                                            : null
                                        }
                                        {
                                            originPath === "trash" ?
                                                <>
                                                    <Tooltip title={"Delete forever"}>
                                                        <Button onClick={() => { setModalDeleteForever(true) }} size="large" shape="circle" type="text" icon={<MdOutlineDeleteForever style={{ fontSize: 24 }} />} />
                                                    </Tooltip>
                                                    <Tooltip title={"Restore document"}>
                                                        <Button onClick={() => { setModalRestore(true) }} size="large" shape="circle" type="text" icon={<MdOutlineSettingsBackupRestore style={{ fontSize: 24 }} />} />
                                                    </Tooltip>
                                                </>
                                                : null
                                        }

                                    </div>
                                </div>
                            </div>
                            <Pagination
                                pageSizeOptions={[12, 24, 36, 48]}
                                showQuickJumper showSizeChanger
                                onChange={(newPage, newPageSize) => changePagination(newPage, newPageSize)}
                                current={documentResult.current}
                                total={documentResult.total}
                                pageSize={documentResult.pageSize}
                            />
                        </div>
                        <>
                            <div style={{ flex: "1 1 auto", width: "100%", height: "100%", display: "flex", columnGap: selectedDoc.length == 1 ? 16 : 0, justifyContent: "space-between" }}>
                                <div style={{ display: "flex", flexDirection: "column", width: selectedDoc.length == 1 && originPath !== "trash" ? "70%" : "100%", transition: "width 0.3s" }}>
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
                                                        <Row gutter={selectedDoc.length == 1 && originPath !== "trash" ? [8, 8] : [16, 16]} style={{ transition: "row-gap 0.3s" }}>
                                                            {
                                                                documentResult.loading == false
                                                                    ? documentResult.documents.map((item, index) =>
                                                                        <Col
                                                                            // md={selectedDoc.length == 1 ? 6 : 4}
                                                                            md={4}
                                                                            key={index} style={{ transition: "width 0.3s, padding 0.3s" }}>
                                                                            <Card
                                                                                // onDoubleClick={() => {
                                                                                //     navigate(`/document/${item.uid}`, {
                                                                                //         // item.versions[0].file_name.slice(0, -16)
                                                                                //         state: {
                                                                                //             breadState: [
                                                                                //                 { "title": originTitle, "path": `/${originPath}` },
                                                                                //                 { "title": `${item.versions[0].file_name ? item.versions[0].file_name : item.uid}`, "path": `/document/${item.uid}` }
                                                                                //             ]

                                                                                //         }
                                                                                //     })
                                                                                // }}
                                                                                style={{
                                                                                    transition: "width 0.3s, height 0.3s",
                                                                                    // borderColor: antdTheme.token.colorBorder,
                                                                                    backgroundColor: selectedDoc.find((seDoc) => seDoc.uid == item?.uid) ? antdTheme.token.controlItemBgActiveHover : antdTheme.token.colorBgLayout
                                                                                }}

                                                                                hoverable styles={{
                                                                                    body: {
                                                                                        paddingTop: 16,
                                                                                        paddingLeft: 16,
                                                                                        paddingBottom: 16,
                                                                                        paddingRight: 16
                                                                                    }
                                                                                }}>
                                                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                                                                    <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                                                                                        <FontAwesomeIcon icon={icon({ name: 'file-pdf', family: 'classic', style: 'solid' })} style={{ color: "#e2574c" }} />
                                                                                        <Typography.Title onClick={(e) => ctrlSetSelectedDocuments(e, item)} ellipsis={{ rows: 1 }} level={5} style={{ margin: 0, width: selectedDoc.length == 1 && originPath !== "trash" ? 100 : 150 }}>{item.versions[0]?.file_name ? item.versions[0]?.file_name : item.uid}</Typography.Title>
                                                                                    </div>
                                                                                    <Checkbox checked={selectedDoc.find((seDoc) => seDoc.uid == item.uid)} onChange={(e) => { setSelectedDocuments(e, item) }} />
                                                                                </div>

                                                                                <div onClick={(e) => ctrlSetSelectedDocuments(e, item)} className="pdfBorder" style={{
                                                                                    transition: "height 0.3s", height: selectedDoc.length == 1 && originPath !== "trash" ? 100 : 150, overflow: "hidden", display: "flex", borderRadius: selectedDoc.length == 1 && originPath !== "trash" ? 4 : 8,
                                                                                    // border: `1px solid ${antdTheme.token.colorBorder}`
                                                                                }}>
                                                                                    <Image src={item.versions[0]?.url.length > 0
                                                                                        ? `//image.thum.io/get/pdfSource/page/1/${item.versions[0]?.url}`
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
                                                            border: `1px solid ${antdTheme.token.colorBorder}`
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
                                {originPath !== "trash"
                                    ? <CardSelectedDoc
                                        selectedDoc={selectedDoc}
                                        setSelectedDoc={setSelectedDoc}
                                        setSelectedKey={setSelectedKey}
                                        originTitle={originTitle}
                                        originPath={originPath} />
                                    : null
                                }
                                {/* <CardSelectedDoc
                                    selectedDoc={selectedDoc}
                                    setSelectedDoc={setSelectedDoc}
                                    selectedKey={selectedKey}
                                    setSelectedKey={setSelectedKey}
                                    originTitle={originTitle}
                                    originPath={originPath} /> */}

                            </div>
                        </>
                    </div >
                </>
                : <div style={{ flex: "1 1 auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        description={<Typography.Text>No documents</Typography.Text>} />
                </div>
            )
            :
            <>
                <div style={{ height: 40, display: "flex", justifyContent: "space-between", marginBottom: 16, marginTop: 1, alignItems: "center" }}>
                    <div style={{ height: "80%", width: "10%" }}>
                        <Skeleton.Button active block className="mySkele" />
                    </div>
                    <div style={{ height: "80%", width: "30%" }}>
                        <Skeleton.Button active block className="mySkele" />
                    </div>
                </div>
                {gridList == "list" ?
                    <Table
                        columns={documentColumns}
                        // rowKey={(record) => record.uid}
                        dataSource={[]}
                        style={{
                            borderRadius: 8, cursor: "pointer",
                        }}
                        pagination={false}
                        loading={true}
                    />
                    : <Row gutter={[16, 16]}>
                        {Array.from('X'.repeat(18)).map((item, index) =>
                            <Col md={4} key={index} style={{ height: 216 }}>
                                <Skeleton.Button active block className="mySkele" />
                            </Col>)}
                    </Row>
                }

            </>
    )

}

export default DocumentFeed