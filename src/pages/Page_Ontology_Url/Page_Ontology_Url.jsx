import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    Skeleton
} from "antd"
import {
    DownloadOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { getOntology, addNewNode, graphToTree } from "../../apis/ontologyApi";
import Bread from "../../components/Bread/Bread";
import CardSelectedNode from "./CardSelectedNode/CardSelectedNode";


const Section_Ontology_Url = () => {
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [selectedNode, setSelectedNode] = useState(null)
    let [selectedEdge, setSelectedEdge] = useState(null)
    let [newNode, setNewNode] = useState("")
    let { ontologyUrl } = useParams()
    useEffect(() => {
        // console.log("USE EFFECT!!!!!!!!!!!!!!!!!!!!!!!!")
        async function fetchData() {
            let result = await getOntology(ontologyUrl)
            dispatchOntology({ type: "setOntology", payload: result })
        }
        fetchData()
    }, [])

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
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread breadProp={[
                    {
                        "title": "Ontology",
                        "path": "/ontology"
                    },
                    {
                        "title": ontology?.name,
                        "path": `/ontology/${ontology?.url}`
                    }
                ]}
                    extraComponent={<Button loading={ontology.loadingDownload} icon={<DownloadOutlined />} onClick={() => { handleDownloadOntology() }}>Export JSON</Button>} />
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
                                        />
                                    </Card>
                                </Col>
                                <Col md={8} style={{ display: "flex", flexDirection: "column", rowGap: 16, height: "100%" }}>
                                    <Card style={{ flex: "0 1 auto" }}>
                                        <div style={{ display: "flex", flexDirection: "column", rowGap: 16, justifyContent: "space-between" }}>
                                            <Space>
                                                <Typography.Title level={3} style={{ margin: 0 }}>
                                                    {ontology.name}
                                                </Typography.Title>
                                                <Tag style={{ height: 36, display: "flex", alignItems: "center", fontSize: 16 }} color={"green"}>{ontology.nodes.length} nodes</Tag>
                                                <Tag style={{ height: 36, display: "flex", alignItems: "center", fontSize: 16 }} color={"cyan"}>{ontology.edges.length} edges</Tag>
                                            </Space>
                                            <Space.Compact
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                <Input value={newNode} onChange={(e) => setNewNode(e.target.value)} />
                                                <Button loading={ontology.loadingAddNode} disabled={newNode ? false : true} onClick={() => handleAddNode()}>Add new node</Button>
                                            </Space.Compact>
                                        </div>
                                    </Card>
                                    {selectedNode
                                        ? <CardSelectedNode selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                                        : null}
                                    {selectedEdge
                                        ? <Card title={"Selected Edge"}>
                                            <Typography.Text>From: </Typography.Text>
                                            <Typography.Text>{selectedEdge.from_label} </Typography.Text>
                                            <br />
                                            <Typography.Text>To: </Typography.Text>
                                            <Typography.Text>{selectedEdge.to_label} </Typography.Text>
                                        </Card>
                                        : null}
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