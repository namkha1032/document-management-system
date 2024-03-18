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
    Button
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
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();
const DocumentFeed = () => {
    let [gridList, dispatchGridList] = useContext(GridListContext)
    let [selectedDoc, setSelectedDoc] = useState(false)
    let [documentResult, setDocumentResult] = useState(null)
    let antdTheme = theme.useToken()
    const navigate = useNavigate()
    useEffect(() => {
        let documentObj = {
            document_title: "Nghị quyết 19/NQ-CP",
            document_size: "1MB",
            document_owner: {
                owner_name: "Nam Kha",
                owner_avatar: "https://styles.redditmedia.com/t5_53zrzx/styles/profileIcon_s4vsse5n5nq71.jpg?width=256&height=256&frame=1&auto=webp&crop=256:256,smart&s=e74d89cd945ec619fe1956b52989f6cedfc5fdf5"
            },
            document_created: '2024-02-03T13:47:56.668Z',
            document_updated: '2024-02-03T13:47:56.668Z',
            document_pdf: '/file/01-cp.signed.pdf',
        }
        let tempArr = Array.from('X'.repeat(24));
        let docArr = tempArr.map((item, index) => {
            return {
                ...documentObj,
                document_id: index
            }
        })
        let response = {
            pagination: {},
            documents: [...docArr]
        }
        setDocumentResult(response)
    }, [])
    let documentColumns = [
        {
            title: "Name",
            render: (obj) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <FontAwesomeIcon icon={icon({ name: 'file-pdf', family: 'classic', style: 'solid' })} style={{ color: "#e2574c" }} />
                        <Typography.Text>{obj.document_title}</Typography.Text>
                    </div>
                )
            }
        },
        {
            title: "Size",
            render: (obj) => {
                return (
                    <Typography.Text>{obj.document_size}</Typography.Text>
                )
            }
        },
        {
            title: "Owner",
            render: (obj) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <Avatar src={obj.document_owner.owner_avatar} />
                        <Typography.Text>{obj.document_owner.owner_name}</Typography.Text>
                    </div>
                )
            }
        },
        {
            title: "Created date",
            render: (obj) => {
                return (
                    <Typography.Text>{new Date(obj.document_created).toLocaleDateString()}</Typography.Text>
                )
            }
        },
        {
            title: "Last updated",
            render: (obj) => {
                return (
                    <Typography.Text>{new Date(obj.document_updated).toLocaleDateString()}</Typography.Text>
                )
            }
        }
    ]
    return (
        documentResult
            ?
            <div style={{ flex: "1 1 auto" }}>
                {gridList == "grid"
                    ?
                    <Row gutter={[16, 16]} style={{ height: "100%" }}>
                        <Col md={selectedDoc ? 16 : 24} style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ flex: 1, position: "relative" }}>
                                <Row style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    overflowY: "scroll"
                                }} gutter={[16, 16]}>
                                    {documentResult.documents.map((item, index) =>
                                        <Col md={selectedDoc ? 6 : 4} key={index}>
                                            <Card
                                                onDoubleClick={() => { navigate(`/document/${item.document_id}`) }}
                                                style={{ backgroundColor: selectedDoc?.document_id == item?.document_id ? antdTheme.token.controlItemBgActive : antdTheme.token.colorBgContainer }}
                                                onClick={() => { setSelectedDoc(item) }} hoverable styles={{
                                                    body: {
                                                        padding: 16
                                                    }
                                                }}>
                                                <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 8 }}>
                                                    <FontAwesomeIcon icon={icon({ name: 'file-pdf', family: 'classic', style: 'solid' })} style={{ color: "#e2574c" }} />
                                                    <Typography.Title level={5} style={{ margin: 0 }}>{item.document_title}</Typography.Title>
                                                </div>
                                                <div style={{ height: 150, overflow: "hidden", display: "flex", border: `1px solid ${antdTheme.token.colorBorder}`, borderRadius: 8 }}>
                                                    <Document file={item.document_pdf}>
                                                        <Page
                                                            width={250}
                                                            pageNumber={1} />
                                                    </Document>
                                                </div>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>

                            </div>
                        </Col>
                        {/* {selectedDoc
                            ? <Col md={8}>
                                <Card
                                    extra={<Button type={"text"} icon={<CloseOutlined />} onClick={() => { setSelectedDoc(null) }} />}
                                    style={{ height: "100%" }}
                                >

                                </Card>
                            </Col>
                            : null} */}
                        <Col md={selectedDoc ? 8 : 0} style={{ transition: "width 0.5s" }}>
                            <Card
                                extra={<Button type={"text"} icon={<CloseOutlined />} onClick={() => { setSelectedDoc(null) }} />}
                                style={{ height: "100%", transition: "width 0.5s" }}
                            >

                            </Card>
                        </Col>
                    </Row>
                    :
                    <>
                        <Table
                            columns={documentColumns}
                            rowKey={(record) => record.document_id}
                            dataSource={documentResult.documents}
                            style={{ borderRadius: 8 }}
                        // loading={searchResult.loading}
                        // pagination={{
                        //     ...searchResult.pagination,
                        //     position: ['bottomCenter']
                        // }}
                        // pagination={false}
                        // onChange={handleTableChange}
                        />
                    </>
                }
            </div>
            :
            <Typography.Text>hehehe</Typography.Text>
    )

}

export default DocumentFeed