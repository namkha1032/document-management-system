// MetadataTab.js

import React, { useEffect, useState } from 'react';
import './MetadataTab.css';
import {
    PlusOutlined,
    CheckOutlined
} from '@ant-design/icons';
import {
    Button,
    Input,
    Row,
    Col,
    Typography
} from 'antd';
const MetadataTab = (props) => {
    const metadata = props.metadata
    const setMetadata = props.setMetadata
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');


    const handleAddPair = () => {
        if (newKey.trim() === '' || newValue.trim() === '') {
            alert('Please enter both key and value.');
            return;
        }

        // Update the metadata with the new key-value pair
        const updatedMetadata = [...metadata, { [newKey]: newValue }];
        setMetadata(updatedMetadata)
        // Your logic to handle the updated metadata (e.g., update state or send to parent component)

        // Clear the input fields
        setNewKey('');
        setNewValue('');
    };
    function handleUpdateMetadata(key, value) {
        let newMetadata = metadata.map((item, index) => {
            if (Object.entries(item)[0][0] == key) {
                let newMetadataItem = {
                    [key]: value
                }
                return newMetadataItem
            }
            else {
                return item
            }
        })
        setMetadata(newMetadata)
    }
    // let
    return (
        <div className="metadata-tab">
            <h3>OCR Result</h3>
            {metadata && (
                <>
                    {metadata.map((item, index) => {
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
                    <h4 style={{ margin: ".5em" }}>Add new metadata:</h4>

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
                </>
            )
            }
            {/* <br />
            <button style={{ float: "right" }} onClick={onClose}>Close</button> */}
        </div >
    );
};

export default MetadataTab;
