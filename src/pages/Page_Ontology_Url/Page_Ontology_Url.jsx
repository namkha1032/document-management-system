import { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Graph from "react-graph-vis";
import ModeThemeContext from "../../context/ModeThemeContext";
import OntologyContext from "../../context/OntologyContext";
import { OntologyProvider } from "../../context/OntologyContext";
import {
    Typography,
    Button,
    Row,
    Col,
    Card,
    Space,
    Input,
    Tag,
    Skeleton,
    Empty,
    Cascader
} from "antd"
import {
    DownloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { getOntology, addNewNode, graphToTree, renameOntology } from "../../apis/ontologyApi";
import Bread from "../../components/Bread/Bread";
import CardSelectedNode from "./CardSelectedNode/CardSelectedNode";


const Section_Ontology_Url = () => {
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [selectedNode, setSelectedNode] = useState(null)
    let [selectedEdge, setSelectedEdge] = useState(null)
    let [isRenameOntology, setIsRenameOntology] = useState(false)
    let [newOntologyName, setNewOntologyName] = useState("")
    let [graphState, setGraphState] = useState(null)
    let [newNode, setNewNode] = useState("")
    let [searchNode, setSearchNode] = useState(null)
    let { ontologyUrl } = useParams()
    const navigate = useNavigate()
    const ontologyNameRef = useRef(null)
    useEffect(() => {
        // console.log("USE EFFECT!!!!!!!!!!!!!!!!!!!!!!!!")
        async function fetchData() {
            let result = await getOntology(ontologyUrl)
            dispatchOntology({ type: "setOntology", payload: result })
            setNewOntologyName(result.name)
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (isRenameOntology) {
            ontologyNameRef.current.focus({
                cursor: 'end',
            });
        }
    }, [isRenameOntology])
    console.log("ontology: ", ontology)
    const graphOptions = {
        "layout": {
            // "randomSeed": 69,
            "improvedLayout": true,
            "hierarchical": {
                "direction": "LR",
                "sortMethod": "directed",
                "levelSeparation": 300,
                "shakeTowards": "roots"
            }
        },
        "edges": {
            "color": modeTheme == "light" ? "#000000" : "#FFFFFF",
            "smooth": {
                "enabled": true
            }
        },
        "height": "100%",
        // "autoResize": true,
        "nodes": {
            "shape": 'box',
            // "mass": 2
        },
        // "physics": {
        //     "barnesHut": {
        //         "springConstant": 0,
        //         "avoidOverlap": 1
        //     }
        // }
        "physics": false
    };

    const graphEvents = {
        selectNode: (obj) => {
            const findNode = ontology.nodes.find((node) => node.id == obj.nodes[0])
            setSelectedEdge(null)
            setSelectedNode(findNode)
        },
        selectEdge: (obj) => {
            if (obj.nodes.length == 0) {
                const findEdge = ontology.edges.find((edge) => edge.id == obj.edges[0])
                setSelectedEdge(findEdge)
            }
        },
        deselectNode: (obj) => {
            if (obj.edges.length > 0 && obj.nodes.length == 0) {
                const findEdge = ontology.edges.find((edge) => edge.id == obj.edges[0])
                setSelectedEdge(findEdge)
                setSelectedNode(null)
            }
            else {
                setSelectedNode(null)
            }
        },
        deselectEdge: (obj) => {
            if (obj.edges.length > 0) {
                const findEdge = ontology.edges.find((edge) => edge.id == obj.edges[0])
                setSelectedEdge(findEdge)
            }
            else {
                setSelectedEdge(null)
            }
        }
    };
    function removeAccents(str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    function filterSearchNode(inputValue, path) {
        return path.some((option) => {
            return option.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1
        });
    }
    async function handleAddNode() {
        dispatchOntology({ type: "triggerLoadingAddNode" })
        let newlyAddedNode = await addNewNode({ name: newNode, ontologyId: ontology.ontologyId })
        dispatchOntology({ type: "addNode", payload: newlyAddedNode })
        setNewNode("")
        dispatchOntology({ type: "triggerLoadingAddNode" })
    }
    async function handleDownloadOntology() {
        dispatchOntology({ type: "triggerLoadingDownload" })
        let treeResponse = await graphToTree(ontology)
        const jsonString = JSON.stringify(treeResponse, null, 4);
        // const jsonString = JSON.stringify(treeResponse);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${ontology.url}.json`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        dispatchOntology({ type: "triggerLoadingDownload" })
    }
    async function handleUpdateOntologyName() {
        dispatchOntology({ type: "triggerLoadingRenameOntology" })
        let response = await renameOntology(ontology.ontologyId, { name: newOntologyName })
        dispatchOntology({ type: "renameOntology", payload: response })
        setIsRenameOntology(false)
        navigate(`/ontology/${response.url}`)
        setSelectedNode((oldNode) => JSON.parse(JSON.stringify(oldNode)))
        dispatchOntology({ type: "triggerLoadingRenameOntology" })
    }
    async function handleSearchNode(id) {
        if (id) {
            const findNode = ontology.nodes.find((node) => node.id == id)
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
            setSearchNode(findNode.id)
            setSelectedNode(findNode)
        }
        else {
            setSearchNode(null)
        }
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread createButtonType={"ontology"} breadProp={[
                    {
                        "title": "Ontology",
                        "path": "/ontology"
                    },
                    {
                        "title": ontology?.name,
                        "path": `/ontology/${ontology?.url}`
                    }
                ]}
                    extraComponent={<Button loading={ontology.loadingDownload} icon={<DownloadOutlined />} onClick={() => { handleDownloadOntology() }}>Export JSON</Button>}
                />
            </div>
            {
                ontology.nodes.length > 0 ?
                    <>
                        <div style={{ flex: "1 1 auto" }}>
                            <Row style={{ height: "100%" }} gutter={[16, 16]}>
                                <Col md={16} style={{ height: "100%" }}>
                                    <Card style={{ height: "100%" }} styles={{
                                        body: {
                                            height: "100%", padding: 0
                                        }
                                    }}>
                                        <Graph
                                            graph={ontology}
                                            options={graphOptions}
                                            events={graphEvents}
                                            getNetwork={network => {
                                                //  if you want access to vis.js network api you can set the state in a parent component using this property
                                                setGraphState(network)
                                            }}
                                        />
                                    </Card>
                                </Col>
                                <Col md={8} style={{ display: "flex", flexDirection: "column", rowGap: 16, height: "100%" }}>
                                    <Card style={{ flex: "0 1 auto" }}>
                                        <Row gutter={[0, 16]}>
                                            <Col md={14}>
                                                <>
                                                    {
                                                        isRenameOntology
                                                            ? <Space.Compact onBlur={(e) => {
                                                                if (e.relatedTarget && e.relatedTarget.tagName === 'BUTTON') {
                                                                    return;
                                                                }
                                                                setIsRenameOntology(false)
                                                                setNewOntologyName(ontology.name)
                                                            }}>
                                                                <Input size="large" value={newOntologyName} ref={ontologyNameRef} onChange={(e) => { setNewOntologyName(e.target.value) }} />
                                                                <Button
                                                                    size="large"
                                                                    onClick={() => { handleUpdateOntologyName() }}
                                                                    loading={ontology.loadingRenameOntology}
                                                                    disabled={newOntologyName == ontology.name}
                                                                    icon={<CheckOutlined />} />
                                                            </Space.Compact>
                                                            : <Space onClick={() => {
                                                                setIsRenameOntology(true)
                                                            }}>
                                                                <Typography.Title level={3} style={{ margin: 0 }}>
                                                                    {ontology.name}
                                                                </Typography.Title>
                                                                <Typography.Title level={3} style={{ margin: 0 }}>
                                                                    <EditOutlined />
                                                                </Typography.Title>
                                                            </Space>
                                                    }
                                                </>
                                            </Col>
                                            <Col md={10}>
                                                <Cascader
                                                    style={{ width: "100%" }}
                                                    options={ontology.parentOptions}
                                                    value={searchNode}
                                                    onChange={(id, node) => {
                                                        console.log("id: ", id)
                                                        console.log("node: ", node)
                                                        handleSearchNode(id)
                                                    }}
                                                    placeholder="Search node..."
                                                    showSearch={{
                                                        filter: filterSearchNode
                                                    }}
                                                />
                                            </Col>
                                            <Col md={14}>
                                                <Space>
                                                    <Tag style={{ height: 36, display: "flex", alignItems: "center", fontSize: 16 }} color={"green"}>{ontology.nodes.length} nodes</Tag>
                                                    <Tag style={{ height: 36, display: "flex", alignItems: "center", fontSize: 16 }} color={"cyan"}>{ontology.edges.length} edges</Tag>
                                                </Space>
                                            </Col>
                                            <Col md={10}>
                                                <Space.Compact
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Input style={{ width: "100%" }} placeholder="Add new node..." value={newNode} onChange={(e) => setNewNode(e.target.value)} />
                                                    <Button icon={<PlusOutlined />} loading={ontology.loadingAddNode} disabled={newNode ? false : true} onClick={() => handleAddNode()}></Button>
                                                </Space.Compact>
                                            </Col>
                                        </Row>
                                    </Card>
                                    {selectedNode
                                        ? <CardSelectedNode setSearchNode={setSearchNode} graphState={graphState} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                                        : (selectedEdge
                                            ? <Card title={"Selected Edge"}>
                                                <Typography.Text>From: </Typography.Text>
                                                <Typography.Text>{selectedEdge.from_label} </Typography.Text>
                                                <br />
                                                <Typography.Text>To: </Typography.Text>
                                                <Typography.Text>{selectedEdge.to_label} </Typography.Text>
                                            </Card>
                                            : <div style={{ flex: "1 1 auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                                    description={<Typography.Text>Please select a node or an edge to start editing</Typography.Text>} />
                                            </div>
                                        )
                                    }
                                </Col>
                            </Row>
                        </div>
                    </>
                    : <>
                        <div style={{ flex: "1 1 auto" }}>
                            <Row style={{ height: "100%" }} gutter={[16, 16]}>
                                <Col md={16} style={{ height: "100%" }}>
                                    <Card style={{ height: "100%" }} styles={{
                                        body: {
                                            height: "100%"
                                        }
                                    }}>
                                        <Skeleton active />
                                    </Card>
                                </Col>
                                <Col md={8} style={{ display: "flex", flexDirection: "column", rowGap: 16, height: "100%" }}>
                                    <Card style={{ flex: "0 1 auto" }}>
                                        <Skeleton avatar active />
                                    </Card>
                                    <Card style={{ flex: "1 1 auto" }}>
                                        <Skeleton avatar active />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </>
            }
        </div>


    )
}

const Page_Ontology_Url = () => {
    return (
        <OntologyProvider>
            <Section_Ontology_Url />
        </OntologyProvider>
    )
}
export default Page_Ontology_Url