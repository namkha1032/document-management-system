import { useContext, useState, useEffect } from "react";
import ModeThemeContext from "../../context/ModeThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Table,
    Modal,
    Upload,
    Popconfirm,
    Tabs,
    Input,
    Card,
    Skeleton,
    Select
} from "antd"
import {
    ShareAltOutlined,
    PlusOutlined,
    UploadOutlined,
    CheckOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    CodeBlock,
    a11yDark,
    a11yLight,
    anOldHope,
    androidstudio,
    arta,
    atomOneDark,
    atomOneLight,
    codepen,
    dracula,
    far,
    github,
    googlecode,
    hopscotch,
    hybrid,
    irBlack,
    monoBlue,
    monokaiSublime,
    monokai,
    nord,
    noctisViola,
    obsidian,
    ocean,
    paraisoDark,
    paraisoLight,
    pojoaque,
    purebasic,
    railscast,
    rainbow,
    shadesOfPurple,
    solarizedDark,
    solarizedLight,
    sunburst,
    tomorrowNightBlue,
    tomorrowNightBright,
    tomorrowNightEighties,
    tomorrowNight,
    tomorrow,
    vs2015,
    xt256,
    zenburn
} from 'react-code-blocks';
import { getAllOntologiesNew, uploadOntologyFile, deleteOntology, createNewOntology } from "../../apis/ontologyApi";

import OntologyAllContext from "../../context/OntologyAllContext";

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
const CreateOntology = () => {
    let [modalOpen, setModalOpen] = useState(false)
    let [fileList, setFileList] = useState([])
    let [newOntologyName, setNewOntologyName] = useState("")
    let [loadingCreateOntology, setLoadingCreateOntology] = useState(false)
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [createTab, setCreateTab] = useState("1")
    let [ontologyAll, dispatchOntologyAll] = useContext(OntologyAllContext)
    let [selectedDomainOntology, setSelectedDomainOntology] = useState(null)
    console.log("CreateOnto ontologyall", ontologyAll)
    const navigate = useNavigate()
    let exampleJSON =
        `{
        "name": "Ontology name",
        "children": [
                {
                        "name": "Node A",
                        "children": [
                                {
                                        "name": "Node B"
                                },
                                {
                                        "name": "Node C"
                                }
                        ]
                }
        ]
}`
    const createModalTab = [
        {
            key: '1',
            label: 'Create from scratch',
            children: <div>
                <Input size="large" placeholder="Enter ontology name" value={newOntologyName} onChange={(e) => { setNewOntologyName(e.target.value) }} />
            </div>,
        },
        {
            key: '2',
            label: 'Inherit from default ontology',
            children: <div>
                <Select
                    size="large"
                    style={{ width: "100%" }}
                    showSearch
                    allowClear
                    options={ontologyAll?.filter((onto, idx) => onto.available == 0)?.map((onto, idx) => {
                        return {
                            value: onto.ontologyId,
                            label: onto.ontologyName
                        }
                    })}
                    // options={[]}
                    placeholder="Select a domain"
                    value={selectedDomainOntology}
                    // optionFilterProp="children"
                    onChange={(value) => { setSelectedDomainOntology(value) }}
                    // onSearch={(val) => { console.log("val", val) }}
                    filterOption={(input, option) =>
                        removeAccents(option?.label ?? '').toLowerCase().includes(removeAccents(input).toLowerCase())} />
            </div>,
        }
    ]
    async function handleUploadOntology() {
        setLoadingCreateOntology(true)
        const formData = new FormData();
        formData.append("ontology_file", fileList[0])
        let newOntology = await uploadOntologyFile(formData)
        navigate(`/ontology/${newOntology.url}`)
        setLoadingCreateOntology(false)
    }
    async function handleCreateOntology() {
        setLoadingCreateOntology(true)
        let newOntology = await createNewOntology({ name: newOntologyName ? newOntologyName : "", ontologyId: selectedDomainOntology ? selectedDomainOntology : "" })
        navigate(`/ontology/${newOntology.ontologyId}`)
        let response2 = await getAllOntologiesNew()
        dispatchOntologyAll({
            type: "update",
            payload: response2
        })
        setLoadingCreateOntology(false)
    }
    console.log("selected", selectedDomainOntology)
    
    return (
        <>
            <Modal style={{ top: 150 }} title="Create new ontology" open={modalOpen}
                maskClosable={true}
                okButtonProps={{
                    icon: < CheckOutlined />,
                    loading: loadingCreateOntology,
                    disabled: (!selectedDomainOntology && createTab == "2") || (newOntologyName == "" && createTab == "1")
                }}
                okText={"Create"}
                onOk={() => { handleCreateOntology() }}
                onCancel={() => { setModalOpen(false) }}>

                <Tabs animated={{ inkBar: true, tabPane: false }} activeKey={createTab} items={createModalTab} onChange={(key) => { setCreateTab(key) }} />
                {/* <Input placeholder="Enter ontology name" value={newOntologyName} onChange={(e) => { setNewOntologyName(e.target.value) }} /> */}
            </Modal >
            <Button onClick={() => { setModalOpen(true) }} type="primary" icon={<PlusOutlined />} size={"large"}>
                New ontology
            </Button>
        </>
    )
}

export default CreateOntology