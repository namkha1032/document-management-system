import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './Page_Upload.css';
import Bread from '../../components/Bread/Bread';
import { Select, Button, Input, notification, Col, Row } from 'antd';
import { UploadOutlined, CaretRightOutlined, CheckOutlined } from '@ant-design/icons';
import MetadataTab from './Page_Upload_MetaData';
import Container from '@mui/material/Container';
import axios from 'axios';
import delay from '../../functions/delay';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUploader = () => {
    const [metadata, setMetadata] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [file, setFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1);
    const [showMetadataTab, setShowMetadataTab] = useState(false);
    const [inputPage, setInputPage] = useState("");
    const [template, setTemplate] = useState("thongtu")
    const [loading, setLoading] = useState(false)
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Document uploaded successfully',
            description:
                'Your document has been saved successfully.',
        });
    };
    console.log('metadata', metadata)
    const pagesPerView = 1;

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setNumPages(null);
    };

    const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= numPages) setCurrentPage(newPage);
    };

    const handleZoom = (newScale) => setScale(newScale);

    const handleExtract = async () => {
        setLoading(true)
        await delay(1000)
        let newForm = new FormData()
        newForm.append('pdf_file', file)
        // const rawResponse = await axios.post(`https://f637-2402-800-6370-9187-a4ff-1ff8-9f7f-2fb1.ngrok-free.app/api/ocr?template_type=${template}`, newForm)
        const rawResponse = await axios.get('http://localhost:3000/data/metadata.json')
        const data = await rawResponse.data;
        setMetadata(data.metadata);
        setShowMetadataTab(true);
        setLoading(false)
    };

    async function handleSave() {
        // console.log('Save');
        setLoading(true)
        await delay(1000)
        openNotificationWithIcon('success')
        setLoading(false)
    }

    const handleTemplateChange = (value) => {
        // console.log(`selected ${value}`)
    }

    const handleInputChange = (e) => {
        const newPage = parseInt(e.target.value, 10);
        if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages)
            setCurrentPage(newPage);
    };

    const handleGoToPage = () => {
        const pageNumber = parseInt(inputPage, 10);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= numPages) {
            setCurrentPage(pageNumber);
            setInputPage("");
        }
    };

    return (
        <>
            {contextHolder}
            <Bread title="New Document" />
            {/* <Container> */}
            <div className='page_upload' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {!showMetadataTab
                    ?
                    <div className="navbar">
                        <label htmlFor="file-upload" className="custom-file-upload">
                            <UploadOutlined />
                            Choose File
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            onChange={onFileChange}
                            accept=".pdf"
                        />
                    </div>
                    : null
                }
                {file && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                <div className='hehe'>
                                    <div className="nav-controls">
                                        <div style={{ borderRight: 'solid 1px #fff', paddingRight: '2em' }}>
                                            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                                                &lt;
                                            </Button>
                                            <span>
                                                <Input
                                                    value={currentPage.toString()}
                                                    onChange={handleInputChange}
                                                    onPressEnter={handleGoToPage}
                                                    style={{ width: '2em', height: '2em', padding: '.3em' }}
                                                />/{numPages}
                                            </span>
                                            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= numPages}>
                                                &gt;
                                            </Button>
                                        </div>
                                        <div style={{ marginLeft: '2em' }}>
                                            <Button onClick={() => handleZoom(scale + 0.1)}>Zoom In</Button>
                                            <Button onClick={() => handleZoom(scale - 0.1)}>Zoom Out</Button>
                                            <Button onClick={() => handleZoom(1)}>Fit to Width</Button>
                                        </div>
                                    </div>
                                    <div className="pdf-content" id="pdf-viewer">
                                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                            {Array.from(new Array(pagesPerView), (el, index) => (
                                                <Page key={`page_${currentPage + index}`} pageNumber={currentPage + index} scale={scale} />
                                            ))}
                                        </Document>
                                    </div>
                                </div>
                                {showMetadataTab && <MetadataTab metadata={metadata} setMetadata={setMetadata} onClose={() => setShowMetadataTab(false)} />}
                            </div>
                            {!showMetadataTab ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', columnGap: 16 }}>
                                        <h2>Select OCR template: </h2>
                                        <Select
                                            defaultValue="thongtu"
                                            style={{
                                                width: 200,
                                            }}
                                            onChange={(value) => setTemplate(value)}
                                            options={[
                                                {
                                                    value: 'thongtu',
                                                    label: 'Thông tư',
                                                },
                                                {
                                                    value: 'quyetdinh',
                                                    label: 'Quyết định',
                                                },
                                                {
                                                    value: 'else',
                                                    label: 'Something else',
                                                },
                                            ]}
                                        />
                                    </div>

                                    <Button loading={loading} icon={<CaretRightOutlined />} type="primary" size="large" onClick={handleExtract}>
                                        Start Extract
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'right', marginTop: '1em' }}>
                                    <Button loading={loading} icon={<CheckOutlined />} type="primary" size="large" onClick={handleSave}>
                                        Save Document
                                    </Button>
                                </div>

                            )}
                        </div>
                    </>
                )}
            </div>
            {/* </Container> */}
        </>
    );
};

export default PdfUploader;
