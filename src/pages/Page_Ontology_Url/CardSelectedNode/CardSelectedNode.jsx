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
    Cascader
} from "antd"
import {
    DeleteOutlined,
    PlusOutlined,
    CloseOutlined,
    EditOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { deleteNode, apiUpdateSenseLabel, apiAddEdge, apiDeleteEdge } from "../../../apis/ontologyApi";
import OntologyContext from "../../../context/OntologyContext";

function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}


const ChildrenRow = (props) => {
    const child = props.child
    const setChildren = props.setChildren
    let [loadingDeleteChildrenEdge, setLoadingDeleteChildrenEdge] = useState(false)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    async function handleDeleteChildrenEdge() {
        setLoadingDeleteChildrenEdge(true)
        let deletedEdge = await apiDeleteEdge(child.id)
        dispatchOntology({ type: "apiDeleteEdge", payload: deletedEdge })
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

const CardSelectedNode = (props) => {
    const selectedNode = props.selectedNode
    const setSelectedNode = props.setSelectedNode
    const setSearchNode = props.setSearchNode
    const graphState = props.graphState
    const nodeNameRef = useRef(null)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [parent, setParent] = useState(null)
    let [children, setChildren] = useState([])
    let [nodeName, setNodeName] = useState(selectedNode.label)
    let [isRename, setIsRename] = useState(false)
    let [newParent, setNewParent] = useState(null)
    let [newChildren, setNewChildren] = useState(null)
    useEffect(() => {
        setNodeName(selectedNode.label)
        setIsRename(false)
        setNewParent(null)
        setNewChildren(null)
        let findParent = ontology.edges.find((edge) => {
            return edge.to == selectedNode.id
        })
        let findChildren = ontology.edges.filter((edge) => {
            return edge.from == selectedNode.id
        })
        setParent(findParent ? findParent : null)
        setChildren(findChildren ? findChildren : [])
    }, [selectedNode])
    useEffect(() => {
        if (isRename) {
            nodeNameRef.current.focus({
                cursor: 'end',
            });
        }
    }, [isRename])

    function filterParent(inputValue, path) {
        return path.some((option) => {
            return option.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1 && option.label != selectedNode.label
        });
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
        dispatchOntology({ type: "addEdge", payload: newParentEdge })
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
    async function handleAddChildrenEdge() {
        dispatchOntology({ type: "triggerLoadingAddChildrenEdge" })
        let request = {
            "from_id": selectedNode.id,
            "to_id": newChildren[0]
        }
        let newChildrenEdge = await apiAddEdge(request)
        dispatchOntology({ type: "addEdge", payload: newChildrenEdge })
        setChildren([
            ...children,
            {
                "id": newChildrenEdge.id,
                "from": newChildrenEdge.from,
                "to": newChildrenEdge.to,
                "from_label": newChildrenEdge.from_label,
                "to_label": newChildrenEdge.to_label,
            }
        ])
        setNewChildren(null)
        dispatchOntology({ type: "triggerLoadingAddChildrenEdge" })
    }
    async function handleDeleteParentEdge() {
        dispatchOntology({ type: "triggerLoadingDeleteParentEdge" })
        let deletedEdge = await apiDeleteEdge(parent.id)
        dispatchOntology({ type: "apiDeleteEdge", payload: deletedEdge })
        setParent(null)
        dispatchOntology({ type: "triggerLoadingDeleteParentEdge" })
    }
    async function handleUpdateNodeName() {
        dispatchOntology({ type: "triggerLoadingUpdateNodeName" })
        let newNode = await apiUpdateSenseLabel(selectedNode.id, { name: nodeName })
        dispatchOntology({ type: "apiUpdateSenseLabel", payload: newNode })
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
            <div style={{ flex: "0 1" }}>
                {!selectedNode.hasOwnProperty("color")
                    ? <>
                        <Typography.Title style={{ marginTop: 0 }} level={5}>Parent: </Typography.Title>
                        {parent
                            ? <div style={{ display: "flex", columnGap: 8, overflowY: "scroll" }}>
                                <Input value={parent.from_label} readOnly />
                                <Button loading={ontology.loadingDeleteParentEdge} danger icon={<DeleteOutlined />} onClick={() => { handleDeleteParentEdge() }} />
                            </div>
                            : <div style={{ display: "flex", columnGap: 8, overflowY: "scroll" }}>
                                <Cascader
                                    style={{ width: "100%" }}
                                    options={ontology.parentOptions.filter((opt) => opt.label != selectedNode.label)}
                                    value={newParent}
                                    onChange={(id, node) => { setNewParent(id) }}
                                    placeholder="Enter parent name..."
                                    showSearch={{
                                        filter: filterParent
                                    }}
                                // searchValue={searchParent}
                                // onSearch={(value) => setSearchParent(value)}
                                />
                                <Button loading={ontology.loadingAddParentEdge} disabled={!newParent} type={"primary"} icon={<PlusOutlined />} onClick={() => { handleAddParentEdge() }} />
                            </div>
                        }
                        <Divider />
                    </>
                    : null
                }
                <Typography.Title style={{ marginTop: 0 }} level={5}>Children: </Typography.Title>
            </div>
            <div style={{ flex: 1, position: "relative" }}>
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflowY: "scroll"
                }}>
                    {children.map((child, index) =>
                        <div style={{ display: "flex", columnGap: 8, marginBottom: 8 }} key={index}>
                            <ChildrenRow child={child} setChildren={setChildren} />
                        </div>
                    )}
                    <div style={{ display: "flex", columnGap: 8, marginBottom: 8 }}>
                        {/* <Space> */}
                        <Cascader
                            style={{ width: "100%" }}
                            options={ontology.childrenOptions.filter((opt) => opt.label != selectedNode.label)}
                            value={newChildren}
                            onChange={(id, node) => { setNewChildren(id) }}
                            placeholder="Enter children name..."
                            showSearch={{
                                filter: filterParent
                            }}
                        />
                        <Button loading={ontology.loadingAddChildrenEdge} disabled={!newChildren} type={"primary"} icon={<PlusOutlined />} onClick={() => { handleAddChildrenEdge() }} />
                        {/* </Space> */}
                    </div>
                </div>
            </div>

        </Card >
    )
}

export default CardSelectedNode