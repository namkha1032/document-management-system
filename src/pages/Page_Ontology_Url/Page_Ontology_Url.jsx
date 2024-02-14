import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Graph from "react-graph-vis";
import ModeThemeContext from "../../context/ModeThemeContext";
import {
    Typography,
    Button,
    Row,
    Col,
    Card
} from "antd"
import { getOntology } from "../../apis/ontologyApi";
import Bread from "../../components/Bread/Bread";
const Page_Ontology_Url = () => {
    let [ontology, setOntology] = useState(null)
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let AUTH = ("neo4j", "xPJefRcLVTarN1_kGJoDaCVRK8crW1FV1nApXqDiGbo")
    let { ontologyUrl } = useParams()
    useEffect(() => {
        async function fetchData() {
            let result = await getOntology(ontologyUrl)
            setOntology(result)
        }
        fetchData()
    }, [])

    const options = {
        "layout": {
            "randomSeed": 69,
            "improvedLayout": true,
            // "hierarchical":{
            //     "direction": "LR"
            // }
        },
        "edges": {
            "color": modeTheme == "light" ? "#000000" : "#FFFFFF",
        },
        "height": "100%",
        nodes: {
            shape: 'box',
            mass: 2
        },
        // "physics": {
        //     "barnesHut": {
        //         "springConstant": 0,
        //         "avoidOverlap": 1
        //     }
        // }
    };

    const events = {
        click: (obj) => {
            // console.log("vis: ", obj)
        }
    };
    function handleAddNode() {
        let newOntology = {
            nodes: [
                ...ontology.nodes,
                {
                    id: `${ontology.nodes.length}`,
                    label: `Node ${ontology.nodes.length}`
                }
            ],
            edges: [...ontology.edges]
        }
        setOntology(newOntology)
    }
    function handleUpdateNote() {
        let newOntology = {
            nodes: ontology.nodes.map(oldNode => {
                if (oldNode.label == "Pháp luật") {
                    return {
                        "id": "Pháp luật",
                        "label": "Khoa học máy tính",
                        "color": "cyan"
                    }
                }
                else return oldNode
            }),
            edges: [...ontology.edges]
        }
        setOntology(newOntology)
    }
    return (
        <>
            <Bread breadProp={[
                {
                    "title": "Ontology",
                    "path": "/ontology"
                },
                {
                    "title": ontology?.name,
                    "path": `/ontology/${ontology?.url}`
                }
            ]} />
            {
                ontology ?
                    <>
                        <Row style={{ height: "90%" }}>
                            <Col md={20} style={{ height: "100%" }}>
                                <Card style={{ height: "100%" }}>
                                    <Graph
                                        graph={ontology}
                                        options={options}
                                        events={events}
                                    />
                                </Card>
                            </Col>
                            <Col md={4} style={{ height: "100%" }}>
                                <Button onClick={handleAddNode} >Add node</Button>
                                <Button onClick={handleUpdateNote} >Update node</Button>
                            </Col>
                        </Row>
                    </>
                    : <Typography.Text>loading...</Typography.Text>
            }
        </>


    )
}

export default Page_Ontology_Url