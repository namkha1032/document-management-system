import { useState, useEffect } from "react";
import {
    Typography,
    Row,
    Col,
    Card,
    theme,
    Table,
    Avatar,
    Button,
    Statistic,
    Input,
    Modal,
    Skeleton
} from "antd"
// import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { CiShoppingTag } from "react-icons/ci";
import { AiFillSignal } from "react-icons/ai";
import {
    TagOutlined,
    ClockCircleOutlined,
    UngroupOutlined,
    CloseOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import { apiGetDocument, apiUpdateMetadata } from "../../apis/documentApi";

const MetadataUpdateForm = (props) => {
    let newMetadata = props.newMetadata
    let setNewMetadata = props.setNewMetadata
    let metadataKeyNum = 7
    let metadataValueNum = 14
    let metadataButtonNum = 2
    let metadataColonNum = 1
    let [newPair, setNewPair] = useState({
        key: "",
        value: ""
    })
    function deleteMetadataPair(index) {
        let newlyMetadataPair = JSON.parse(JSON.stringify(newMetadata))
        newlyMetadataPair.splice(index, 1)
        setNewMetadata(newlyMetadataPair)
    }
    function addMetadata() {
        setNewMetadata([
            ...newMetadata,
            {
                [newPair.key]: newPair.value
            }
        ])
        setNewPair({
            key: "",
            value: ""
        })
    }

    function editMetadata(idx, key, value) {
        let newlyEditedMetadata = JSON.parse(JSON.stringify(newMetadata))
        newlyEditedMetadata.splice(idx, 1, {
            [key]: value
        })
        setNewMetadata(newlyEditedMetadata)
    }
    return (
        <>
            {newMetadata && newMetadata?.map((item, index) => {
                return (<Row key={index} style={{ marginTop: 8 }} gutter={[8, 8]}>
                    <Col span={metadataButtonNum}>
                        <Button onClick={() => deleteMetadataPair(index)} type={"text"} shape={"circle"} icon={<CloseOutlined />} />
                    </Col>
                    <Col span={metadataKeyNum}>
                        {/* <Typography.Text>{Object.entries(item)[0][0]}</Typography.Text> */}
                        <Input.TextArea onChange={(e) => editMetadata(index, e.target.value, Object.entries(item)[0][1])} autoSize={{ minRows: 1, maxRows: 4 }} value={Object.entries(item)[0][0]} />
                    </Col>
                    <Col span={metadataColonNum} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                        <Typography.Text>:</Typography.Text>
                    </Col>
                    <Col span={metadataValueNum}>
                        {Object.entries(item)[0][0] == 'Văn bản liên quan'
                            ? JSON.parse(Object.entries(item)[0][1].replaceAll("'", '"')).map((ite, index, arr) =>
                                <Input.TextArea style={{ marginBottom: index + 1 == arr.length ? 0 : 8 }} key={index} autoSize={{ minRows: 1, maxRows: 4 }} value={ite} />
                            )
                            : <Input.TextArea onChange={(e) => editMetadata(index, Object.entries(item)[0][0], e.target.value)} autoSize={{ minRows: 1, maxRows: 4 }} value={Object.entries(item)[0][1]} />
                        }
                    </Col>
                </Row>)
            }
            )}
            <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                <Col span={2}>
                    <Button onClick={() => addMetadata()} shape="circle" icon={<PlusOutlined />} />
                </Col>
                <Col span={7}>
                    <Input value={newPair.key} onChange={(e) => setNewPair({
                        ...newPair,
                        key: e.target.value
                    })} placeholder="key" />
                </Col>
                <Col span={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography.Text>:</Typography.Text>
                </Col>
                <Col span={14}>
                    <Input value={newPair.value} onChange={(e) => setNewPair({
                        ...newPair,
                        value: e.target.value
                    })} placeholder="value" />
                </Col>
            </Row>
        </>
    )
}

export default MetadataUpdateForm