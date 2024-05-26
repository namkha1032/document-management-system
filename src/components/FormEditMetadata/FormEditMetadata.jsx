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
    Skeleton,
    AutoComplete
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
    PlusOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import { apiLiveSearchMetadata } from "../../apis/documentApi";


function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function filterSearchNode(inputValue, path) {
    // console.log("inputValue", inputValue)
    // console.log("path", path)
    // return path.some((option) => {
    //     return option.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1
    // });
    return path.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1
}

const KeyValueForm = (props) => {
    let item = props.item
    let index = props.index
    let newMetadata = props.newMetadata
    let setNewMetadata = props.setNewMetadata
    let metadataButtonNum = props.metadataButtonNum
    let metadataKeyNum = props.metadataKeyNum
    let metadataColonNum = props.metadataColonNum
    let metadataValueNum = props.metadataValueNum
    let options = props.options
    let setOptions = props.setOptions
    let type = props.type
    let [kvPair, setKvPair] = useState({
        key: Object.entries(item)[0][0],
        value: Object.entries(item)[0][1]
    })
    useEffect(() => {
        const timer = setTimeout(() => {
            // async function getSuggestions() {
            //     setOptions([{
            //         value: "loading", label: <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            //             <LoadingOutlined />
            //         </div>
            //     }])
            //     let response = await apiLiveSearchMetadata(kvPair.key)
            //     console.log("query: ", response)
            //     setOptions(response.data)
            // }
            // if (kvPair.key != Object.entries(item)[0][0] || kvPair.value != Object.entries(item)[0][1]) {
            //     getSuggestions()
            //     editMetadata(index, kvPair.key, kvPair.value)
            // }
            editMetadata(index, kvPair.key, kvPair.value)
        }, 500)
        return () => clearTimeout(timer)
    }, [kvPair])
    useEffect(() => {
        if (kvPair.key != Object.entries(item)[0][0] || kvPair.value != Object.entries(item)[0][1]) {
            setKvPair({
                key: Object.entries(item)[0][0],
                value: Object.entries(item)[0][1]
            })
        }
    }, [newMetadata])
    function deleteMetadataPair() {
        // let newlyMetadataPair = JSON.parse(JSON.stringify(newMetadata))
        let newlyMetadataPair = newMetadata.filter((item, idx) => idx != index)
        // newlyMetadataPair.splice(index, 1)

        setNewMetadata(newlyMetadataPair)
    }
    function editMetadata() {
        let newlyEditedMetadata = JSON.parse(JSON.stringify(newMetadata))
        newlyEditedMetadata.splice(index, 1, {
            [kvPair.key]: kvPair.value
        })
        setNewMetadata(newlyEditedMetadata)
    }
    function isStringArray(str) {
        try {
            const arr = JSON.parse(str);
            return Array.isArray(arr);
        } catch (error) {
            return false; // Parsing failed, not an array
        }
    }
    return (
        <>
            <Col span={metadataButtonNum}>
                <Button onClick={() => deleteMetadataPair()} type={"text"} shape={"circle"} icon={<CloseOutlined />} />
            </Col>
            <Col span={metadataKeyNum}>
                {/* <Typography.Text>{Object.entries(item)[0][0]}</Typography.Text> */}
                {/* <Input.TextArea onChange={(e) => setKvPair({ ...kvPair, key: e.target.value })} autoSize={{ minRows: 1, maxRows: 4 }} value={kvPair.key} /> */}
                {type == "edit" ?
                    <AutoComplete style={{ width: "100%" }} onSearch={(val) => {
                        setKvPair({ ...kvPair, key: val })
                    }} options={options} value={kvPair.key}
                        filterOption={filterSearchNode}
                        onSelect={(val, node) => {
                            // console.log("node", node)
                            setKvPair({ ...kvPair, key: node.label })
                        }}
                    />
                    : <Input.TextArea autoSize={{ minRows: 1, maxRows: 4 }} value={kvPair.key} readOnly />
                }
            </Col>
            <Col span={metadataColonNum} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                <Typography.Text>:</Typography.Text>
            </Col>
            <Col span={metadataValueNum}>
                {/* {
                    isStringArray(Object.entries(item)[0][1].replaceAll("'", '"')) > 0
                        ? JSON.parse(Object.entries(item)[0][1].replaceAll("'", '"')).map((ite, index, arr) =>
                            <Input.TextArea style={{ marginBottom: index + 1 == arr.length ? 0 : 8 }} key={index} autoSize={{ minRows: 1, maxRows: 4 }} value={ite} />
                        )
                        : <Input.TextArea onChange={(e) => setKvPair({ ...kvPair, value: e.target.value })} autoSize={{ minRows: 1, maxRows: 4 }} value={kvPair.value} />
                } */}
                <Input.TextArea readOnly={type == "view"} onChange={(e) => setKvPair({ ...kvPair, value: e.target.value })} autoSize={{ minRows: 1, maxRows: 4 }} value={kvPair.value} />
            </Col>
        </>
    )
}

const FormEditMetadata = (props) => {
    let newMetadata = props.newMetadata
    let setNewMetadata = props.setNewMetadata
    let type = props.type
    let metadataKeyNum = type == "view" ? 9 : 7
    let metadataValueNum = type == "view" ? 14 : 14
    let metadataButtonNum = type == "view" ? 0 : 2
    let metadataColonNum = type == "view" ? 1 : 1
    let [newPair, setNewPair] = useState({
        key: "",
        value: ""
    })
    let [options, setOptions] = useState([])
    useEffect(() => {
        async function getSuggestions() {
            let response = await apiLiveSearchMetadata("")
            setOptions(response.data.map((res, idx) => {
                return {
                    ...res,
                    compareLabel: removeAccents(res.label)
                }
            }))
        }
        getSuggestions()
    }, [])
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
    return (
        <>
            {newMetadata && newMetadata?.map((item, index) => {
                return (<Row key={index} style={{ marginTop: 8 }} gutter={[8, 8]}>

                    <KeyValueForm
                        item={item}
                        index={index}
                        newMetadata={newMetadata}
                        setNewMetadata={setNewMetadata}
                        metadataButtonNum={metadataButtonNum}
                        metadataKeyNum={metadataKeyNum}
                        metadataColonNum={metadataColonNum}
                        metadataValueNum={metadataValueNum}
                        type={type}
                        options={options}
                        setOptions={setOptions}
                    />
                </Row>)
            }
            )}
            {type == "edit"
                ? <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                    <Col span={2}>
                        <Button onClick={() => addMetadata()} shape="circle" icon={<PlusOutlined />} />
                    </Col>
                    <Col span={7}>
                        {/* <Input value={newPair.key} onChange={(e) => setNewPair({
                            ...newPair,
                            key: e.target.value
                        })} placeholder="key" variant="filled" /> */}
                        <AutoComplete variant="filled" style={{ width: "100%" }} onSearch={(val) => {
                            setNewPair({ ...newPair, key: val })
                        }} options={options} value={newPair.key}
                            filterOption={filterSearchNode}
                            onSelect={(val, node) => {
                                // console.log("node", node)
                                setNewPair({ ...newPair, key: node.label })
                            }}
                        />
                    </Col>
                    <Col span={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography.Text>:</Typography.Text>
                    </Col>
                    <Col span={14}>
                        <Input value={newPair.value} onChange={(e) => setNewPair({
                            ...newPair,
                            value: e.target.value
                        })} placeholder="value" variant="filled" />
                    </Col>
                </Row>
                : null}
        </>
    )
}

export default FormEditMetadata