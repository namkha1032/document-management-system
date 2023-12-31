import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './Page_Upload.css'; // Import the external CSS file
import Bread from "../../components/Bread/Bread"
import { Select, Button } from 'antd';
import {
    UploadOutlined
} from '@ant-design/icons';
import MetadataTab from "./Page_Upload_MetaData"; // Import your MetadataTab component

// Set worker URL to initialize PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUploader = () => {
    const [metadata, setMetadata] = useState(null); // State to store fetched metadata
    const [numPages, setNumPages] = useState(null);
    const [file, setFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1);
    const [showMetadataTab, setShowMetadataTab] = useState(false); // State to manage the visibility of the metadata tab
    const [inputPage, setInputPage] = useState(""); // State to store the input page number
    const pagesPerView = 1; // Number of pages to show in a single view

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setNumPages(null); // Reset numPages when a new file is selected
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= numPages) {
            setCurrentPage(newPage);
        }
    };

    const handleZoomIn = () => {
        setScale(scale + 0.1);
    };

    const handleZoomOut = () => {
        setScale(scale - 0.1);
    };

    const handleFitToWidth = () => {
        setScale(1);
    };

    const handleExtract = async () => {
        let raw = await fetch("http://localhost:3000/data/metadata.json");
        let data = await raw.json();

        // Set the fetched metadata in the state
        setMetadata(data.metadata);

        // Show metadata tab when the "Start Extract" button is clicked
        setShowMetadataTab(true);
    };

    const handleSave = () => {
        console.log("Save");
    };

    const handleExportChange = (value) => {
        console.log(`selected ${value}`);
    };

    const handleInputChange = (e) => {
        setInputPage(e.target.value);
    };

    const handleGoToPage = () => {
        const pageNumber = parseInt(inputPage, 10);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= numPages) {
            setCurrentPage(pageNumber);
            setInputPage(""); // Clear the input after navigating to the page
        }
    };

    return (
        <>
            <Bread title={"New Document"} />

            <div className="pdf-viewer-container">
                <div className="navbar">
                    <label htmlFor="file-upload" className="custom-file-upload" >
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
                    <div className='main-content'>
                        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                            <div>
                                <div className="nav-controls">
                                    <div style={{ borderRight: "solid 1px #fff", paddingRight: "2em" }}>
                                        <button onClick={() => handlePageChange(currentPage - pagesPerView)} disabled={currentPage <= 1}>
                                            &lt;
                                        </button>
                                        <span>
                                            <input
                                                type="text"
                                                defaultvalue={`${currentPage}`}
                                                onChange={handleInputChange}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleGoToPage();
                                                    }
                                                }}
                                                style={{ width: "2em", height: "2em" }}
                                            />/{numPages}
                                        </span>
                                        <button onClick={() => handlePageChange(currentPage + pagesPerView)} disabled={currentPage + pagesPerView > numPages}>
                                            &gt;
                                        </button>
                                    </div>

                                    {/* <button onClick={handleGoToPage}>Go</button> */}
                                    <div style={{ marginLeft: "2em" }}>
                                        <button onClick={handleZoomIn}>
                                            Zoom In
                                        </button>
                                        <button onClick={handleZoomOut}>
                                            Zoom Out
                                        </button>
                                        <button onClick={handleFitToWidth}>
                                            Fit to Width
                                        </button>
                                    </div>
                                </div>
                                <div className="pdf-content" id="pdf-viewer">
                                    <Document
                                        file={file}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                    >
                                        {Array.from(new Array(pagesPerView), (el, index) => (
                                            <Page
                                                key={`page_${currentPage + index}`}
                                                pageNumber={currentPage + index}
                                                scale={scale}
                                            />
                                        ))}
                                    </Document>
                                </div>
                            </div>
                            {showMetadataTab && (
                                <MetadataTab metadata={metadata} onClose={() => setShowMetadataTab(false)} />
                            )}
                        </div>
                        {!showMetadataTab ? (
                            <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                                <div className='extract-div'>
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
                                    <Button type="primary" size={"large"} onClick={handleExtract}>
                                        Start Extract
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", width: "90%", justifyContent: "right", marginTop: "1em" }}>
                                <Button type="primary" size={"large"} onClick={handleSave}>
                                    Save Document
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div >
        </>
    );
};

export default PdfUploader;
