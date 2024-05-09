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
    Cascader,
    Select
} from "antd"
import {
    DownloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { getOntology, addNewNode, graphToTree, renameOntology, getOntologyId } from "../../apis/ontologyApi";
import Bread from "../../components/Bread/Bread";
import CardSelectedNode from "./CardSelectedNode/CardSelectedNode";
const Search_Node = (props) => {
    const ontology = props.ontology
    const graphState = props.graphState
    const searchNode = props.searchNode
    const setSearchNode = props.setSearchNode
    const setSelectedNode = props.setSelectedNode
    function removeAccents(str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    async function handleSearchNode(id) {
        // console.log("search id", id)
        let ontologyIdSplit = ontology.ontologyId.split(':')
        let preId = `${ontologyIdSplit[0]}:${ontologyIdSplit[1]}:${id}`
        if (id) {
            const findNode = ontology.nodes.find((node) => node.id == preId)
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
        else {
            setSearchNode(null)
            setSelectedNode(null)
        }
    }
    function filterSearchNode(inputValue, path) {
        // console.log("inputValue", inputValue)
        // console.log("path", path)
        // return path.some((option) => {
        //     return option.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1
        // });
        return path.compareLabel.toLowerCase().indexOf(removeAccents(inputValue).toLowerCase()) > -1
    }
    return (
        <>
            {/* <Cascader
                style={{ width: "100%" }}
                options={ontology.nodes}
                value={searchNode.label}
                onChange={(id, node) => {
                    console.log("node", id)
                    handleSearchNode(id)
                }}
                placeholder="Search node..."
                showSearch={{
                    filter: filterSearchNode
                }}
            /> */}
            <Select
                showSearch={true}
                allowClear
                value={searchNode?.label}
                // placeholder={props.placeholder}
                // style={props.style}
                style={{ width: "100%" }}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={filterSearchNode}
                // onSearch={handleSearch}
                onChange={(id, node) => {
                    // console.log("id in select", id)
                    // console.log("node in select", node)
                    handleSearchNode(id)
                }}
                notFoundContent={null}
                options={ontology.nodes}
            />
        </>
    )
}

const Section_Ontology_Id = () => {
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [ontology, dispatchOntology] = useContext(OntologyContext)
    let [selectedNode, setSelectedNode] = useState(null)
    let [selectedEdge, setSelectedEdge] = useState(null)
    let [isRenameOntology, setIsRenameOntology] = useState(false)
    let [newOntologyName, setNewOntologyName] = useState("")
    let [graphState, setGraphState] = useState(null)
    let [newNode, setNewNode] = useState("")
    let [searchNode, setSearchNode] = useState(null)
    let { ontologyId } = useParams()
    console.log("Page_Ontology_Url: ontology", ontology)
    const navigate = useNavigate()
    const ontologyNameRef = useRef(null)
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
    useEffect(() => {
        async function fetchData() {
            let response = await getOntologyId(ontologyId)
            dispatchOntology({ type: "setOntology", payload: response })
            setNewOntologyName(response.ontologyName)
        }
        fetchData()
    }, [])

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ flex: "0 1 auto" }}>
                    <Bread createButtonType={"ontology"} breadProp={[
                        {
                            "title": "Ontology",
                            "path": "/ontology"
                        },
                        {
                            "title": ontology?.ontologyName,
                            "path": `/ontology/${ontology?.ontologyId}`
                        }
                    ]}
                    // extraComponent={<Button loading={ontology.loadingDownload} icon={<DownloadOutlined />} onClick={() => { handleDownloadOntology() }}>Export JSON</Button>}
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
                                                events={graphEvents}
                                                getNetwork={network => {
                                                    //  if you want access to vis.js network api you can set the state in a parent component using this property
                                                    setGraphState(network)
                                                }}
                                                options={{
                                                    // layout: {
                                                    //     randomSeed: 69,
                                                    //     improvedLayout: true,
                                                    // },
                                                    edges: {
                                                        color: modeTheme == "light" ? "#000000" : "#FFFFFF",
                                                        // "smooth": {
                                                        //     "enabled": true
                                                        // }
                                                    },
                                                    height: "100%",
                                                    nodes: {
                                                        shape: 'box',
                                                        // mass: 1
                                                    },
                                                    // "physics": {
                                                    //     "barnesHut": {
                                                    //         "springConstant": 0,
                                                    //         "avoidOverlap": 1
                                                    //     }
                                                    // }
                                                    physics: {
                                                        enabled: false,
                                                        // "barnesHut": {
                                                        //     // gravitationalConstant: -80000,
                                                        //     // "springConstant": 0,
                                                        //     "avoidOverlap": 0.2,
                                                        //     gravitationalConstant: -80000,
                                                        //     springConstant: 0.001,
                                                        //     springLength: 200
                                                        // },
                                                        // stabilization: {
                                                        //     enabled: true,
                                                        //     iterations: 80000, // You can adjust this to control the level of stabilization
                                                        // },
                                                        // barnesHut: {
                                                        //     // gravitationalConstant: -80000, // Stronger repulsion to avoid overlap
                                                        //     // centralGravity: 0.3, // Keeps nodes centered to avoid too much dispersion
                                                        //     // springLength: 9000, // Distance between connected nodes
                                                        //     // springConstant: 0.001, // Controls the spring force
                                                        //     avoidOverlap: 1,
                                                        //     // gravitationalConstant: -20000, // Stronger repulsion to avoid overlap
                                                        //     // centralGravity: 0.3, // Keeps nodes centered to avoid too much dispersion
                                                        //     // springLength: 95, // Distance between connected nodes
                                                        //     // springConstant: 0.04, // Controls the spring force
                                                        // },
                                                        // stabilization: {
                                                        //     enabled: true,
                                                        //     iterations: 50, // Fewer iterations to speed up stabilization
                                                        //     updateInterval: 25, // More frequent updates for quicker animations
                                                        // },
                                                        // solver: 'barnesHut', // Good for large graphs
                                                        // timestep: 0.7, // Increased timestep for faster animations
                                                        // repulsion: {
                                                        //     nodeDistance: 150, // Controls distance between nodes
                                                        // },
                                                        // stabilization: {
                                                        //     enabled: true,
                                                        // },
                                                    },
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
                                                                    setNewOntologyName(ontology.ontologyName)
                                                                }}>
                                                                    <Input size="large" value={newOntologyName} ref={ontologyNameRef} onChange={(e) => { setNewOntologyName(e.target.value) }} />
                                                                    <Button
                                                                        size="large"
                                                                        // onClick={() => { handleUpdateOntologyName() }}
                                                                        loading={ontology.loadingRenameOntology}
                                                                        disabled={newOntologyName == ontology.ontologyName}
                                                                        icon={<CheckOutlined />} />
                                                                </Space.Compact>
                                                                : <Space onClick={() => {
                                                                    setIsRenameOntology(true)
                                                                }}>
                                                                    <Typography.Title level={3} style={{ margin: 0 }}>
                                                                        {ontology.ontologyName}
                                                                    </Typography.Title>
                                                                    <Typography.Title level={3} style={{ margin: 0 }}>
                                                                        <EditOutlined />
                                                                    </Typography.Title>
                                                                </Space>
                                                        }
                                                    </>
                                                </Col>
                                                <Col md={10}>
                                                    <Search_Node ontology={ontology}
                                                        graphState={graphState}
                                                        searchNode={searchNode}
                                                        setSearchNode={setSearchNode}
                                                        setSelectedNode={setSelectedNode} />
                                                </Col>
                                                <Col md={14}>
                                                    <Space>
                                                        <Tag style={{ height: 36, display: "flex", alignItems: "center", fontSize: 16 }} color={"green"}>{ontology.count_syn} synsets</Tag>
                                                        <Tag style={{ height: 36, display: "flex", alignItems: "center", fontSize: 16 }} color={"cyan"}>{ontology.count_sense} senses</Tag>
                                                    </Space>
                                                </Col>
                                                <Col md={10}>
                                                    <Space.Compact
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    >
                                                        <Input style={{ width: "100%" }} placeholder="Add new node..." value={newNode} onChange={(e) => setNewNode(e.target.value)} />
                                                        <Button icon={<PlusOutlined />} loading={ontology.loadingAddNode} disabled={newNode ? false : true}
                                                        // onClick={() => handleAddNode()}
                                                        ></Button>
                                                    </Space.Compact>
                                                </Col>
                                            </Row>
                                        </Card>
                                        {selectedNode
                                            ? <>
                                                <CardSelectedNode setSearchNode={setSearchNode} graphState={graphState} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                                            </>
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
                                        {/* <Card style={{ height: "100%" }} styles={{
                                            body: {
                                                height: "100%"
                                            }
                                        }}>
                                        </Card> */}
                                        <Skeleton.Button active block className="mySkele" />
                                    </Col>
                                    <Col md={8} style={{ display: "flex", flexDirection: "column", rowGap: 16, height: "100%" }}>
                                        {/* <Card style={{ flex: "0 1 auto" }}>
                                        </Card> */}
                                        <div style={{ height: "20%", width: "100%" }}>
                                            <Skeleton.Button active block className="mySkele" />
                                        </div>
                                        {/* <Card style={{ flex: "1 1 auto" }}>
                                        </Card> */}
                                        <div style={{ height: "80%", width: "100%" }}>
                                            <Skeleton.Button active block className="mySkele" />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </>
                }
            </div>

        </>
    )
}

const Page_Ontology_Id = () => {
    return (
        <OntologyProvider>
            <Section_Ontology_Id />
        </OntologyProvider>
    )
}

export default Page_Ontology_Id