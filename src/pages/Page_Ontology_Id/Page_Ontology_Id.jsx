import { useContext, useState, useEffect } from "react";
import Graph from "react-graph-vis";
import ModeThemeContext from "../../context/ModeThemeContext";
import {
    Typography,
    Button
} from "antd"
const Page_Ontology_Id = () => {
    let [ontology, setOntology] = useState(null)
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    useEffect(() => {
        let responseOntology = {
            nodes: [
                { id: "a", label: "Node a" },
                { id: "b", label: "Node b" },
                { id: "c", label: "Node c" },
                { id: "d", label: "Node d" },
                { id: "e", label: "Node e" }
            ],
            edges: [
                { from: "a", to: "b", id: "a-b" },
                { from: "a", to: "c", id: "a-c" },
                { from: "a", to: "d", id: "a-d" },
                { from: "b", to: "e", id: "b-e" },
                // { from: "e", to: "a" }
            ]
        };
        setOntology(responseOntology)
    }, [])

    const options = {
        edges: {
            color: modeTheme == "light" ? "#000000" : "#FFFFFF",
        },
        height: "100%",
    };

    const events = {
        click: (obj) => {
            console.log("vis: ", obj)
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
    return (
        <>
            <Typography.Text>ontology</Typography.Text>
            {ontology ? <Graph
                graph={ontology}
                options={options}
                events={events}
            />
                : <Typography.Text>loading...</Typography.Text>
            }
            <Button onClick={handleAddNode} >Add node</Button>
        </>
    )
}

export default Page_Ontology_Id