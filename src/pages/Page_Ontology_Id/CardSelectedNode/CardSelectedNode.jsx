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
    Select,
    AutoComplete
} from "antd"
import {
    DeleteOutlined,
    PlusOutlined,
    CloseOutlined,
    EditOutlined,
    CheckOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { deleteNode, apiUpdateSenseLabel, apiAddEdge, apiDeleteEdge, apiUpdateDefinition, apiAddSense, apiAddSynEdge } from "../../../apis/ontologyApi";
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
    async function handleAddSynEdge() {
        setLoadingEdge(true)
        let request = {
            "from_id": selectedNode.id,
            "to_id": newEdge.id,
            "ontologyId": ontology.ontologyId
        }
        let edgeResponse = await apiAddSynEdge(request)
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
            <Typography.Title style={{ marginTop: 0 }} level={5}>{type === "children" ? "Children: " : type === "synset" ? "Synset: " : "Parent: "}</Typography.Title>
            {synsetList.map((syn, index) =>
                <div style={{ display: "flex", columnGap: 8, marginBottom: 8 }} key={index}>
                    <SynsetRow synsetList={synsetList} setSynsetList={setSynsetList} syn={syn} type={type} graphState={graphState} setSearchNode={setSearchNode} setSelectedNode={setSelectedNode} />
                </div>
            )}
            <Space.Compact style={{ width: "100%" }}>
                <Select
                    showSearch={true}
                    allowClear
                    value={newEdge?.label}
                    placeholder={`Add new ${type}...`}
                    // style={props.style}
                    style={{ width: "100%" }}
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    filterOption={filterSearchNode}
                    // onSearch={handleSearch}
                    onChange={(id, node) => {
                        // console.log("id in select", id)
                        // console.log("node in select", node)
                        // let ontologyIdSplit = ontology.ontologyId.split(':')
                        // let preId = `${ontologyIdSplit[0]}:${ontologyIdSplit[1]}:${id}`
                        // const findNode = ontology.nodes.find((node) => node.id == preId)
                        setNewEdge(node)
                    }}
                    notFoundContent={null}
                    options={ontology.nodes.filter((node) => node.type == "Synset" && node?.id !== selectedNode?.id)}
                />
                <Button loading={loadingEdge} disabled={!newEdge || ontology.ontologyId === "4:6189104e-54a2-4243-81ac-77508424ea24:0"} type={"primary"} icon={<PlusOutlined />} onClick={() => {
                    if (type === "synset") {
                        handleAddSynEdge()
                    }
                    else {
                        handleAddEdge()
                    }
                }} />


            </Space.Compact>
        </>
    )
}
const SynsetRow = (props) => {
    let type = props.type
    let syn = props.syn
    let setSearchNode = props.setSearchNode
    let setSelectedNode = props.setSelectedNode
    let graphState = props.graphState
    let synsetList = props.synsetList
    let setSynsetList = props.setSynsetList
    let inputValue = type == "parent" ? syn.from_label : syn.to_label
    let [loadingDeleteEdge, setLoadingDeleteEdge] = useState(false)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    console.log("syn", syn)
    async function handleDeleteEdge() {
        setLoadingDeleteEdge(true)
        await apiDeleteEdge(syn.id, ontology.ontologyId)
        setSynsetList(synsetList.filter((ed, idx) => ed.id !== syn.id))
        dispatchOntology({ type: "deleteEdge", payload: { id: syn.id } })
        setLoadingDeleteEdge(false)
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
            {/* <Space.Compact style={{ width: "100%" }}> */}
            <Input value={inputValue} readOnly variant="filled" />
            <Button icon={<EyeOutlined />} onClick={() => { handleChangeNode() }} />
            <Button disabled={ontology.ontologyId === "4:6189104e-54a2-4243-81ac-77508424ea24:0"} loading={loadingDeleteEdge} danger icon={<DeleteOutlined />} onClick={() => { handleDeleteEdge() }} />
            {/* </Space.Compact> */}
        </>
    )
}

const SenseList = (props) => {
    let sense = props.sense
    let setSense = props.setSense
    let selectedNode = props.selectNode
    let setSelectedNode = props.setSelectedNode
    let setSearchNode = props.setSearchNode
    let graphState = props.graphState
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
        <div style={{ display: "flex", flexDirection: "column", marginTop: 16 }}>
            <Typography.Title style={{ marginTop: 0 }} level={5}>Senses: </Typography.Title>
            {sense.map((se, idx) =>
                <div style={{ display: "flex", columnGap: 8, marginBottom: 8 }} key={idx}>
                    <SenseRow graphState={graphState} se={se} sense={sense} setSense={setSense} setSearchNode={setSearchNode} setSelectedNode={setSelectedNode} />
                </div>)}
            <Space.Compact
                style={{
                    width: '100%',
                }}
            >
                <AutoComplete
                    options={ontology.nodes.filter((node, idx) => node.type == "Sense")}
                    style={{
                        width: "100%",
                    }}
                    // onSelect={onSelect}
                    filterOption={filterSearchNode}
                    value={newSense}
                    onChange={(e, node) => {
                        if (node.label) {
                            setNewSense(node.label)
                        }
                        else {
                            setNewSense(e)
                        }

                    }
                    }
                    // onSearch={(text) => setOptions(getPanelValue(text))}
                    placeholder="input here"
                />
                {/* <Input style={{ width: "100%" }} placeholder="Add new sense..." value={newSense} onChange={(e) => setNewSense(e.target.value)} /> */}
                <Button onClick={() => { handleAddNewSense() }} icon={<PlusOutlined />} loading={loadingNewSense} disabled={newSense && ontology.ontologyId !== "4:6189104e-54a2-4243-81ac-77508424ea24:0" ? false : true} />
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
    let sense = props.sense
    let setSense = props.setSense
    let setSelectedNode = props.setSelectedNode
    let setSearchNode = props.setSearchNode
    let graphState = props.graphState
    let [loadingDeleteEdge, setLoadingDeleteEdge] = useState(false)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    async function handleDeleteEdge() {
        setLoadingDeleteEdge(true)
        await apiDeleteEdge(se.id, ontology.ontologyId)
        setSense(sense.filter((ed, idx) => ed.id !== se.id))
        dispatchOntology({ type: "deleteEdge", payload: { id: se.id } })
        setLoadingDeleteEdge(false)
    }
    async function handleChangeNode() {
        const findNode = ontology.nodes.find((node) => node.id == se.from)
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
            <Input variant="filled" value={se["from_label"]} readOnly />
            <Button icon={<EyeOutlined />} onClick={() => { handleChangeNode() }} />
            <Button disabled={ontology.ontologyId === "4:6189104e-54a2-4243-81ac-77508424ea24:0"} loading={loadingDeleteEdge} onClick={() => { handleDeleteEdge() }} danger icon={<DeleteOutlined />} />
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
        <div style={{ display: 'flex', flexDirection: "column", rowGap: 8 }}>
            <Space>
                <Typography.Title style={{ margin: 0 }} level={5}>Definition: </Typography.Title>
                <Button onClick={() => { handleUpdateDefinition() }} type={"primary"} size="small" loading={loadingDefinition} disabled={selectedNode["definition"] === definition ? true : false}
                >Save</Button>
            </Space>

            <Input.TextArea readOnly={ontology.ontologyId === "4:6189104e-54a2-4243-81ac-77508424ea24:0"} value={definition} onChange={(e) => { setDefinition(e.target.value) }} autoSize={{ minRows: 1, maxRows: 4 }} />

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
    let [synset, setSynset] = useState([])
    let [nodeName, setNodeName] = useState(selectedNode.label)
    let [isRename, setIsRename] = useState(false)
    let [newParent, setNewParent] = useState(null)
    let [newChildren, setNewChildren] = useState(null)
    let [loadingUpdateSenseLabel, setLoadingUpdateSenseLabel] = useState(false)
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
        let findSynset = ontology.edges.filter((edge) => {
            return edge.from == selectedNode.id && (edge.type == "BELONG_TO")
        })
        // console.log("findParent", findParent)
        // console.log("findChildren", findChildren)
        // console.log("findSense", findSense)
        setParent(findParent ? findParent : [])
        setChildren(findChildren ? findChildren : [])
        setSense(findSense ? findSense : [])
        setSynset(findSynset ? findSynset : [])
        console.log("findSense", findSense)
    }, [selectedNode])
    useEffect(() => {
        if (isRename) {
            nodeNameRef.current.focus({
                cursor: 'end',
            });
        }
    }, [isRename])

    async function handleDeleteNode() {
        dispatchOntology({ type: "triggerLoadingDeleteNode" })
        graphState.releaseNode()
        let deletedNode = await deleteNode(selectedNode.id)
        dispatchOntology({ type: "deleteNode", payload: deletedNode })
        setSelectedNode(null)
        setSearchNode(null)
        dispatchOntology({ type: "triggerLoadingDeleteNode" })
    }
    async function handleUpdateNodeName() {
        setLoadingUpdateSenseLabel(true)
        let responseUpdatedLabel = await apiUpdateSenseLabel(selectedNode.id, { label: nodeName, ontologyId: ontology.ontologyId })
        dispatchOntology({ type: "updateSenseLabel", payload: responseUpdatedLabel.updated_sense })
        setIsRename(false)
        // setNodeName("")
        setSelectedNode(responseUpdatedLabel.updated_sense)
        setLoadingUpdateSenseLabel(false)
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
                                loading={loadingUpdateSenseLabel}
                                disabled={nodeName == selectedNode.label}
                                icon={<CheckOutlined />} />
                        </Space.Compact>
                        : <Space onClick={() => {
                            if (selectedNode.type === "Sense") {
                                setIsRename(true)
                            }
                        }}>
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                {selectedNode.label}
                            </Typography.Title>
                            {selectedNode.type === "Sense"
                                ? <EditOutlined />
                                : null}
                        </Space>
                }
            </>
        } extra={
            // <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button disabled={ontology.ontologyId === "4:6189104e-54a2-4243-81ac-77508424ea24:0"} loading={ontology.loadingDeleteNode} icon={<DeleteOutlined />} type="primary" danger onClick={() => { handleDeleteNode() }}>Delete</Button>
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
            <div style={{ flex: 1, position: "relative" }}>
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflowY: "scroll"
                }}>{selectedNode?.type == "Synset"
                    ? <>
                        <DefinitionRow selectNode={selectedNode} setSelectedNode={setSelectedNode} />
                        <SenseList graphState={graphState} sense={sense} setSense={setSense} selectNode={selectedNode} setSelectedNode={setSelectedNode} setSearchNode={setSearchNode} />
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
                    </> : <>
                        <SynsetList
                            type={"synset"}
                            synsetList={synset}
                            setSynsetList={setSynset}
                            graphState={graphState}
                            selectedNode={selectedNode}
                            setSearchNode={setSearchNode}
                            setSelectedNode={setSelectedNode}
                        />
                    </>}
                </div>
            </div>

        </Card >
    )
}

export default CardSelectedNode