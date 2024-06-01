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
import { apiLiveSearchMetadata, apiLiveSemanticSearchMetadata } from "../../apis/documentApi";
import delay from "../../functions/delay";

function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function filterSearchNode(inputValue, optionValue) {
    return removeAccents(optionValue.label).toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1
}
function filterOptionList(inputValue, optionList) {
    return optionList.filter((opt, idx) => filterSearchNode(inputValue, opt))
}
const KeyAC = (props) => {
    let width = props.width
    let variant = props.variant
    let item = props.item
    let kvPair = props.kvPair
    let setKvPair = props.setKvPair
    let options = props.options
    let updatePairFunc = props.updatePairFunc
    let [displayOptions, setDisplayOptions] = useState(JSON.parse(JSON.stringify(options)))
    async function getSuggestions() {
        setDisplayOptions([{
            value: "loading", label: <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <LoadingOutlined />
            </div>
        }])
        // await delay(1000)
        console.log("options", options)
        let newOption = filterOptionList(kvPair.key, options)
        console.log("newOption", newOption)
        let semanticArray = await apiLiveSemanticSearchMetadata({
            key: kvPair.key
        })
        console.log("semanticArray", semanticArray)
        let newSemanticArray = semanticArray?.filter((ke, idx) => {
            for (let i = 0; i < newOption.length; i++) {
                if (newOption[i].value == ke.value) {
                    return false
                }
            }
            return true
        })
        let newOptionWithSemantic = []
        if (newOption?.length > 0) {
            newOptionWithSemantic = newOptionWithSemantic?.concat({
                label: "Matched result",
                options: newOption
            })
        }
        if (newSemanticArray?.length > 0) {
            newOptionWithSemantic = newOptionWithSemantic?.concat({
                label: "Do you mean?",
                options: newSemanticArray
            })
        }
        // console.log("query: ", response)
        setDisplayOptions(newOptionWithSemantic)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            if (item == null) {
                getSuggestions()
                updatePairFunc()
            }
            else if (kvPair.key != Object.entries(item)[0][0] || kvPair.value != Object.entries(item)[0][1]) {
                if (kvPair.key != Object.entries(item)[0][0]) {
                    getSuggestions()
                }
                updatePairFunc()
            }
            // editMetadata(index, kvPair.key, kvPair.value)
        }, 200)
        return () => clearTimeout(timer)
    }, [kvPair])
    return (
        <AutoComplete placeholder={"key"} variant={variant} style={{ width: width }} onSearch={(val) => {
            setKvPair({ ...kvPair, key: val })
        }} options={displayOptions} value={kvPair.key}
            // filterOption={filterSearchNode}
            onSelect={(val, node) => {
                // console.log("node", node)
                setKvPair({ ...kvPair, key: node.label })
            }}
        />
    )
}

export default KeyAC