import { useContext, useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    Button,
    Row,
    Col,
    Card,
    Space,
    Input,
    Divider,
    Cascader,
    Select
} from "antd"
import {
    DeleteOutlined,
    PlusOutlined,
    CloseOutlined,
    EditOutlined,
    CheckOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { deleteNode, updateNodeName, apiAddEdge, deleteEdge, apiUpdateDefinition, apiAddSense } from "../../../apis/ontologyApi";
import OntologyContext from "../../../context/OntologyContext";

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
const SynsetList = (props) => {
    let type = props.type
    let graphState = props.graphState
    let selectedNode = props.selectedNode
    let setSearchNode = props.setSearchNode
    let setSelectedNode = props.setSelectedNode
    let synsetList = props.synsetList
    let setSynsetList = props.setSynsetList
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [loadingEdge, setLoadingEdge] = useState(false)
    let [newEdge, setNewEdge] = useState(null)
    async function handleAddEdge() {
        setLoadingEdge(true)
        let request = {
            "from_id": type == "children" ? selectedNode.id : newEdge.id,
            "to_id": type == "parent" ? selectedNode.id : newEdge.id,
            "ontologyId": ontology.ontologyId
        }
        let edgeResponse = await apiAddEdge(request)
        dispatchOntology({ type: "addEdge", payload: edgeResponse.new_edge })
        setSynsetList([
            ...synsetList,
            edgeResponse.new_edge
        ])
        setNewEdge(null)
        setLoadingEdge(false)
    }
    return (
        <>
            <Typography.Title style={{ marginTop: 0 }} level={5}>{type === "children" ? "Children: " : "Parent: "}</Typography.Title>
            {synsetList.map((syn, index) =>
                <div style={{ display: "flex", columnGap: 8, marginBottom: 8 }} key={index}>
                    <SynsetRow syn={syn} type={type} graphState={graphState} setSearchNode={setSearchNode} setSelectedNode={setSelectedNode} />
                </div>
            )}
            <div style={{ display: "flex", columnGap: 8, marginBottom: 8, width: "100%" }}>
                {/* <Cascader
                            style={{ width: "100%" }}
                            options={ontology.childrenOptions.filter((opt) => opt.label != selectedNode.label)}
                            value={newChildren}
                            onChange={(id, node) => { setNewChildren(id) }}
                            placeholder="Enter children name..."
                            showSearch={{
                                filter: filterSearch
                            }}
                        /> */}
                <Select
                    showSearch={true}
                    allowClear
                    value={newEdge?.label}
                    placeholder={`Search for ${type}`}
                    // style={props.style}
                    style={{ width: "100%" }}
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    filterOption={filterSearchNode}
                    // onSearch={handleSearch}
                    onChange={(id, node) => {
                        // console.log("id in select", id)
                        // console.log("node in select", node)
                        let ontologyIdSplit = ontology.ontologyId.split(':')
                        let preId = `${ontologyIdSplit[0]}:${ontologyIdSplit[1]}:${id}`
                        const findNode = ontology.nodes.find((node) => node.id == preId)
                        setNewEdge(findNode)
                    }}
                    notFoundContent={null}
                    options={ontology.nodes.filter((node) => node.type == "Synset" && node?.id !== selectedNode?.id)}
                />
                <Button loading={loadingEdge} disabled={!newEdge} type={"primary"} icon={<PlusOutlined />} onClick={() => { handleAddEdge() }} />

            </div>
        </>
    )
}
const ChildrenRow = (props) => {
    const child = props.child
    const setChildren = props.setChildren
    let [loadingDeleteChildrenEdge, setLoadingDeleteChildrenEdge] = useState(false)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    async function handleDeleteChildrenEdge() {
        setLoadingDeleteChildrenEdge(true)
        let deletedEdge = await deleteEdge(child.id)
        dispatchOntology({ type: "deleteEdge", payload: deletedEdge })
        // let newChildren = children.filter((c) => c.id != deletedEdge.id)
        setChildren((oldChildren) => oldChildren.filter((c) => c.id != deletedEdge.id))
        setLoadingDeleteChildrenEdge(false)
    }
    return (
        <>
            <Input value={child.to_label} readOnly />
            <Button loading={loadingDeleteChildrenEdge} onClick={() => { handleDeleteChildrenEdge() }} danger icon={<DeleteOutlined />} />
        </>
    )
}

const SenseList = (props) => {
    let sense = props.sense
    let setSense = props.setSense
    let selectedNode = props.selectNode
    let setSelectedNode = props.setSelectedNode
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [newSense, setNewSense] = useState("")
    let [loadingNewSense, setLoadingNewSense] = useState(false)
    async function handleAddNewSense() {
        setLoadingNewSense(true)
        let response = await apiAddSense({
            label: newSense,
            ontologyId: ontology.ontologyId,
            synsetId: selectedNode.id
        })
        dispatchOntology({
            type: "addSense", payload: {
                newSense: response.new_sense,
                newEdge: response.new_rela
            }
        })
        setSense(sense.find((oldse, idx) => oldse.id == response.new_rela.id) ? sense : [
            ...sense,
            response.new_rela
        ])
        setNewSense("")
        setLoadingNewSense(false)
    }
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography.Title style={{ marginTop: 0 }} level={5}>Senses: </Typography.Title>
            {sense.map((se, idx) =>
                <div style={{ display: "flex", columnGap: 8, marginBottom: 8 }} key={idx}>
                    <SenseRow se={se} />
                </div>)}
            <Space.Compact
                style={{
                    width: '100%',
                }}
            >
                <Input style={{ width: "100%" }} placeholder="Add new sense..." value={newSense} onChange={(e) => setNewSense(e.target.value)} />
                <Button onClick={() => { handleAddNewSense() }} icon={<PlusOutlined />} loading={loadingNewSense} disabled={newSense ? false : true} />
            </Space.Compact>
            {/* <div style={{ display: 'flex', flexDirection: "column", rowGap: 8 }}>
                <Space>
                    <Typography.Title style={{ margin: 0 }} level={5}>Definition: </Typography.Title>
                    <Button type={"primary"} size="small" loading={loadingDefinition} disabled={selectedNode["definition"] === definition ? true : false}
                    >Save</Button>
                </Space>

                <Input.TextArea value={definition} onChange={(e) => { setDefinition(e.target.value) }} autoSize={{ minRows: 1, maxRows: 4 }} />

            </div> */}
        </div>

    )
}
const SenseRow = (props) => {
    let se = props.se
    let [loadingDeleteChildrenEdge, setLoadingDeleteChildrenEdge] = useState(false)
    async function handleDeleteSense() {
    }
    return (
        <>
            <Input value={se["from_label"]} readOnly />
            <Button icon={<EyeOutlined />} />
            <Button loading={loadingDeleteChildrenEdge} onClick={() => { handleDeleteSense() }} danger icon={<DeleteOutlined />} />
        </>
    )
}
const SynsetRow = (props) => {
    let type = props.type
    let syn = props.syn
    let setSearchNode = props.setSearchNode
    let setSelectedNode = props.setSelectedNode
    let graphState = props.graphState
    let inputValue = type == "parent" ? syn.from_label : syn.to_label
    let [loadingDeleteParentEdge, setLoadingDeleteParentEdge] = useState(false)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    console.log("syn", syn)
    async function handleDeleteParentEdge() {
    }
    async function handleChangeNode() {
        const findNode = ontology.nodes.find((node) => node.id == (type == "parent" ? syn.from : syn.to))
        await graphState.focus(findNode.id, {
            scale: 1.0,
            // offset: {x:Number, y:Number}
            locked: true,
            animation: {
                duration: 1000,
                easingFunction: "easeInOutCubic"
            }
        })
        graphState.selectNodes([findNode.id])
        setSearchNode(findNode)
        setSelectedNode(findNode)
    }
    return (
        <>
            <Input value={inputValue} readOnly />
            <Button icon={<EyeOutlined />} onClick={() => { handleChangeNode() }} />
            <Button loading={loadingDeleteParentEdge} danger icon={<DeleteOutlined />} onClick={() => { handleDeleteParentEdge() }} />
        </>
    )
}
const DefinitionRow = (props) => {
    let selectedNode = props.selectNode
    let setSelectedNode = props.setSelectedNode
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [definition, setDefinition] = useState("")
    let [loadingDefinition, setLoadingDefinition] = useState(false)
    useEffect(() => {
        setDefinition(selectedNode["definition"])
    }, [selectedNode])
    async function handleUpdateDefinition() {
        setLoadingDefinition(true)
        let response = await apiUpdateDefinition(selectedNode.id, {
            definition: definition,
            ontologyId: ontology.ontologyId
        })
        dispatchOntology({ type: "updateDefinition", payload: response.updated_node })
        setSelectedNode({
            ...selectedNode,
            definition: response.updated_node.definition
        })
        setLoadingDefinition(false)
    }
    return (
        <div style={{ display: 'flex', flexDirection: "column", rowGap: 8, marginTop: 16 }}>
            <Space>
                <Typography.Title style={{ margin: 0 }} level={5}>Definition: </Typography.Title>
                <Button onClick={() => { handleUpdateDefinition() }} type={"primary"} size="small" loading={loadingDefinition} disabled={selectedNode["definition"] === definition ? true : false}
                >Save</Button>
            </Space>

            <Input.TextArea value={definition} onChange={(e) => { setDefinition(e.target.value) }} autoSize={{ minRows: 1, maxRows: 4 }} />

        </div>
    )
}
const CardSelectedNode = (props) => {
    const selectedNode = props.selectedNode
    const setSelectedNode = props.setSelectedNode
    const setSearchNode = props.setSearchNode
    const graphState = props.graphState
    const nodeNameRef = useRef(null)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [parent, setParent] = useState([])
    let [children, setChildren] = useState([])
    let [sense, setSense] = useState([])
    let [nodeName, setNodeName] = useState(selectedNode.label)
    let [isRename, setIsRename] = useState(false)
    let [newParent, setNewParent] = useState(null)
    let [newChildren, setNewChildren] = useState(null)
    useEffect(() => {
        setNodeName(selectedNode.label)
        setIsRename(false)
        setNewParent(null)
        setNewChildren(null)
        console.log("selectedNode:", selectedNode)
        let findParent = ontology.edges.filter((edge) => {
            return edge.to == selectedNode.id && edge.type == "PARENT_OF"
        })
        let findChildren = ontology.edges.filter((edge) => {
            return edge.from == selectedNode.id && (edge.type == "PARENT_OF")
        })
        let findSense = ontology.edges.filter((edge) => {
            return edge.to == selectedNode.id && (edge.type == "BELONG_TO")
        })
        console.log("findParent", findParent)
        console.log("findChildren", findChildren)
        console.log("findSense", findSense)
        setParent(findParent ? findParent : [])
        setChildren(findChildren ? findChildren : [])
        setSense(findSense ? findSense : [])
    }, [selectedNode])
    useEffect(() => {
        if (isRename) {
            nodeNameRef.current.focus({
                cursor: 'end',
            });
        }
    }, [isRename])

    function filterSearch(inputValue, path) {
        // return path.some((option) => {
        //     return option.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1 && option.label != selectedNode.label
        // });
        // return path.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1 && path.label != selectedNode.label
        return path.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1

    }
    async function handleDeleteNode() {
        dispatchOntology({ type: "triggerLoadingDeleteNode" })
        graphState.releaseNode()
        let deletedNode = await deleteNode(selectedNode.id)
        dispatchOntology({ type: "deleteNode", payload: deletedNode })
        setSelectedNode(null)
        setSearchNode(null)
        dispatchOntology({ type: "triggerLoadingDeleteNode" })
    }
    async function handleAddParentEdge() {
        dispatchOntology({ type: "triggerLoadingAddParentEdge" })
        let request = {
            "from_id": newParent[0],
            "to_id": selectedNode.id
        }
        let newParentEdge = await apiAddEdge(request)
        dispatchOntology({ type: "apiAddEdge", payload: newParentEdge })
        setParent({
            "id": newParentEdge.id,
            "from": newParentEdge.from,
            "to": newParentEdge.to,
            "from_label": newParentEdge.from_label,
            "to_label": newParentEdge.to_label,
        })
        setNewParent(null)
        dispatchOntology({ type: "triggerLoadingAddParentEdge" })
    }
    async function handleDeleteParentEdge() {
        dispatchOntology({ type: "triggerLoadingDeleteParentEdge" })
        let deletedEdge = await deleteEdge(parent.id)
        dispatchOntology({ type: "deleteEdge", payload: deletedEdge })
        setParent(null)
        dispatchOntology({ type: "triggerLoadingDeleteParentEdge" })
    }
    async function handleUpdateNodeName() {
        dispatchOntology({ type: "triggerLoadingUpdateNodeName" })
        let newNode = await updateNodeName(selectedNode.id, { name: nodeName })
        dispatchOntology({ type: "updateNodeName", payload: newNode })
        setIsRename(false)
        // setNodeName("")
        setSelectedNode({ "id": newNode.id, "label": newNode.label })
        dispatchOntology({ type: "triggerLoadingUpdateNodeName" })
    }
    return (
        <Card style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }} title={
            <>
                {
                    isRename
                        ? <Space.Compact onBlur={(e) => {
                            if (e.relatedTarget && e.relatedTarget.tagName === 'BUTTON') {
                                return;
                            }
                            setIsRename(false)
                            setNodeName(selectedNode.label)
                        }}>
                            <Input value={nodeName} ref={nodeNameRef} onChange={(e) => { setNodeName(e.target.value) }} />
                            <Button
                                onClick={() => { handleUpdateNodeName() }}
                                loading={ontology.loadingUpdateNodeName}
                                disabled={nodeName == selectedNode.label}
                                icon={<CheckOutlined />} />
                        </Space.Compact>
                        : <Space onClick={() => {
                            if (!selectedNode.hasOwnProperty("color")) {
                                setIsRename(true)
                            }
                        }}>
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                {selectedNode.label}
                            </Typography.Title>
                            {!selectedNode.hasOwnProperty("color")
                                ? <EditOutlined />
                                : null}
                        </Space>
                }
            </>
        } extra={
            // <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button loading={ontology.loadingDeleteNode} icon={<DeleteOutlined />} type="primary" danger onClick={() => { handleDeleteNode() }}>Delete</Button>
            // </div>
        } styles={{
            header: {
                flex: "0 1 auto"
            },
            body: {
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column"
            }
        }}>
            {selectedNode?.type == "Synset"
                ? <div style={{ flex: 1, position: "relative" }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        overflowY: "scroll"
                    }}>
                        <SenseList sense={sense} setSense={setSense} selectNode={selectedNode} setSelectedNode={setSelectedNode} />
                        <DefinitionRow selectNode={selectedNode} setSelectedNode={setSelectedNode} />
                        <Divider />
                        <SynsetList
                            type={"parent"}
                            synsetList={parent}
                            setSynsetList={setParent}
                            graphState={graphState}
                            selectedNode={selectedNode}
                            setSearchNode={setSearchNode}
                            setSelectedNode={setSelectedNode}
                        />
                        <Divider />
                        <SynsetList
                            type={"children"}
                            synsetList={children}
                            setSynsetList={setChildren}
                            graphState={graphState}
                            selectedNode={selectedNode}
                            setSearchNode={setSearchNode}
                            setSelectedNode={setSelectedNode}
                        />
                    </div>
                </div>
                : null
            }

        </Card >
    )
}

export default CardSelectedNode