// MetadataTab.js

import React, { useEffect, useState } from 'react';
import './MetadataTab.css';
import {
    PlusOutlined
} from '@ant-design/icons';
import {
    Button, Input
} from 'antd';
const MetadataTab = ({ metadata, onClose }) => {
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [thisMetadata, setThisMetadata] = useState(metadata)

    useEffect(() => {
        console.log(thisMetadata)
    })

    const handleInputChange = (key, value) => {
        // Your logic to handle input changes
        console.log(`Updated value for ${key}: ${value}`);
    };

    const handleAddPair = () => {
        if (newKey.trim() === '' || newValue.trim() === '') {
            alert('Please enter both key and value.');
            return;
        }

        // Update the metadata with the new key-value pair
        const updatedMetadata = [...thisMetadata, { key: newKey, value: newValue }];
        setThisMetadata(updatedMetadata)
        // Your logic to handle the updated metadata (e.g., update state or send to parent component)
        console.log('Updated Metadata:', updatedMetadata);

        // Clear the input fields
        setNewKey('');
        setNewValue('');
    };

    return (
        <div className="metadata-tab">
            <h3>OCR Result</h3>
            {thisMetadata && (
                <>
                    <div className="metadata-table">
                        <div className="column key-column">
                            {thisMetadata.map(({ key }) => (
                                <div key={key} className="metadata-item key-item">
                                    {key}:
                                </div>
                            ))}
                            {newKey && (
                                <div className="metadata-item key-item">
                                    {newKey}:
                                </div>
                            )}
                        </div>

                        <div className="column value-column">
                            {thisMetadata.map(({ key, value }) => (
                                <div key={key} className="metadata-item value-item">
                                    <Input defaultValue={value} onChange={(e) => handleInputChange(key, e.target.value)} />
                                </div>
                            ))}
                            {newKey && (
                                <div className="metadata-item value-item">
                                    <Input value={newValue} placeholder='New value' onChange={(e) => handleInputChange(newKey, e.target.value)} />
                                </div>
                            )}
                        </div>

                    </div>
                    <h4 style={{ margin: ".5em" }}>Add new metadata:</h4>

                    <div className="metadata-input metadata-item value-item">

                        <Input value={newKey} placeholder='New key' onChange={(e) => setNewKey(e.target.value)} style={{ width: "80%", margin: "0 5px" }} />
                        <Input value={newValue} placeholder='New value' onChange={(e) => setNewValue(e.target.value)} style={{ width: "80%", margin: "0 5px" }} />

                        <Button style={{ padding: "0 8px" }} icon={<PlusOutlined />}
                            onClick={handleAddPair}
                        />
                    </div>
                </>
            )}
            <br />
            <button style={{ float: "right" }} onClick={onClose}>Close</button>
        </div>
    );
};

export default MetadataTab;
