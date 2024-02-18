import { useContext, useState, useEffect } from "react"
import {
    Typography,
    Row,
    Col,
    Card,
    theme,
    Table,
    Avatar
} from "antd"
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
    let [documentResult, setDocumentResult] = useState(null)
    let antdTheme = theme.useToken()
    useEffect(() => {
        let documentObj = {
            document_id: 1,
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
        let docArr = tempArr.map((item, index) => documentObj)
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
            <>
                {gridList == "grid"
                    ?
                    <Row gutter={[16, 16]}>
                        {documentResult.documents.map((item, index) =>
                            <Col md={4} key={index}>
                                <Card styles={{
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
            </>
            :
            <Typography.Text>hehehe</Typography.Text>
    )

}

export default DocumentFeed