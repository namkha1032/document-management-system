import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './Page_Upload.css';
import Bread from '../../components/Bread/Bread';
import { Select, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MetadataTab from './Page_Upload_MetaData';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUploader = () => {
    const [metadata, setMetadata] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [file, setFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1);
    const [showMetadataTab, setShowMetadataTab] = useState(false);
    const [inputPage, setInputPage] = useState("");
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
        const raw = await fetch('http://localhost:3000/data/metadata.json');
        const data = await raw.json();
        setMetadata(data.metadata);
        setShowMetadataTab(true);
    };

    const handleSave = () => console.log('Save');

    const handleExportChange = (value) => console.log(`selected ${value}`);

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
            <Bread title="New Document" />

            <div className="pdf-viewer-container">
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
                {file && (
                    <div className="main-content">
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                            <div>
                                <div className="nav-controls">
                                    <div style={{ borderRight: 'solid 1px #fff', paddingRight: '2em' }}>
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                                            &lt;
                                        </button>
                                        <span>
                                            <Input
                                                value={currentPage.toString()}
                                                onChange={handleInputChange}
                                                onPressEnter={handleGoToPage}
                                                style={{ width: '2em', height: '2em', padding: '.3em' }}
                                            />/{numPages}
                                        </span>
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= numPages}>
                                            &gt;
                                        </button>
                                    </div>
                                    <div style={{ marginLeft: '2em' }}>
                                        <button onClick={() => handleZoom(scale + 0.1)}>Zoom In</button>
                                        <button onClick={() => handleZoom(scale - 0.1)}>Zoom Out</button>
                                        <button onClick={() => handleZoom(1)}>Fit to Width</button>
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
                            {showMetadataTab && <MetadataTab metadata={metadata} onClose={() => setShowMetadataTab(false)} />}
                        </div>
                        {!showMetadataTab ? (
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                <div className="extract-div">
                                    <h2>Select OCR template: </h2>
                                    <Select
                                        defaultValue="0"
                                        style={{
                                            width: 200,
                                        }}
                                        onChange={handleExportChange}
                                        options={[
                                            {
                                                value: '0',
                                                label: 'Phap Luat',
                                            },
                                            {
                                                value: '1',
                                                label: 'Khoa hoc May tinh',
                                            },
                                            {
                                                value: '2',
                                                label: 'Something Else',
                                            },
                                        ]}
                                    />
                                    <Button type="primary" size="large" onClick={handleExtract}>
                                        Start Extract
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', width: '90%', justifyContent: 'right', marginTop: '1em' }}>
                                <Button type="primary" size="large" onClick={handleSave}>
                                    Save Document
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default PdfUploader;
