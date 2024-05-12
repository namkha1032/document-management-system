import { createContext, useReducer } from "react";

let OntologyContext = createContext(null)

function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function ontologyReducer(state, action) {
    switch (action.type) {
        case "setOntology": {
            // let newOntology = JSON.parse(JSON.stringify({
            //     ...state,
            //     ontologyName: action.payload.ontologyName,
            //     url: action.payload.url,
            //     ontologyId: action.payload.ontologyId,
            //     nodes: [...action.payload.nodes],
            //     edges: [...action.payload.edges],
            //     // childrenOptions: [...action.payload.childrenOptions],
            //     // parentOptions: [...action.payload.parentOptions]
            // }))
            let newOntologyCopy = JSON.parse(JSON.stringify(action.payload))
            let newOntology = {
                ...action.payload,
                nodes: newOntologyCopy.nodes.map((node, idx) => {
                    let valueId = node.id.split(":")[2]
                    return {
                        ...node,
                        value: valueId
                    }
                })
            }
            console.log('in reducer', newOntology)
            return newOntology
            // return action.payload
        }
        case "addSynset": {
            let newOntology = {
                ...state,
                nodes: [
                    ...state.nodes,
                    action.payload
                ],
                parentOptions: [],
                childrenOptions: []
            }
            return newOntology
        }
        case "deleteNode": {
            let newOntology = {
                ...state,
                nodes: state.nodes.filter((node) => {
                    return node.id != action.payload.id
                }),
                edges: state.edges.filter((edge) => {
                    return edge.from != action.payload.id && edge.to != action.payload.id
                }),
                // childrenOptions: [...action.payload.childrenOptions],
                // parentOptions: [...action.payload.parentOptions]
            }
            return newOntology
        }
        case "updateNodeName": {
            let newOntology = {
                ...state,
                nodes: state.nodes.map((node) => {
                    if (node.id == action.payload.id) {
                        return {
                            ...node,
                            label: action.payload.label
                        }
                    }
                    else {
                        return node
                    }
                }),
                edges: state.edges.map((edge) => {
                    if (edge.from == action.payload.id) {
                        return {
                            ...edge,
                            from_label: action.payload.label
                        }
                    }
                    else if (edge.to == action.payload.id) {
                        return {
                            ...edge,
                            to_label: action.payload.label
                        }
                    }
                    else {
                        return edge
                    }
                }),
                // parentOptions: [...action.payload.parentOptions],
                // childrenOptions: [...action.payload.childrenOptions]
            }
            return newOntology
        }
        case "updateDefinition": {
            let newOntology = {
                ...state,
                nodes: state.nodes.map((node) => {
                    if (node.id == action.payload.id) {
                        return {
                            ...node,
                            definition: action.payload.definition
                        }
                    }
                    else {
                        return node
                    }
                }),
                parentOptions: [],
                childrenOptions: []
            }
            return newOntology
        }
        case "addSense": {
            let newOntology = {
                ...state,
                nodes: state.nodes.find((node) => node.id == action.payload.newSense.id) ? state.nodes : [
                    ...state.nodes,
                    action.payload.newSense
                ],
                edges:[
                    ...state.edges,
                    action.payload.newEdge
                ],
                parentOptions: [],
                childrenOptions: []
            }
            return newOntology
        }
        case "addEdge": {
            let newOntology = {
                ...state,
                nodes: [...state.nodes],
                edges: [
                    ...state.edges,
                    action.payload
                ],
                // childrenOptions: [...action.payload.childrenOptions],
                // parentOptions: [...action.payload.parentOptions]
            }
            return newOntology
        }
        case "deleteEdge": {
            let newOntology = {
                ...state,
                nodes: [...state.nodes],
                edges: state.edges.filter((edge) => {
                    return edge.id != action.payload.id
                }),
                // childrenOptions: [...action.payload.childrenOptions],
                // parentOptions: [...action.payload.parentOptions]
            }
            return newOntology
        }
        case "renameOntology": {
            let newOntology = {
                ...state,
                ontologyName: action.payload.ontologyName,
                url: action.payload.url,
                nodes: state.nodes.map((node) => {
                    if (node.id == action.payload.id) {
                        return {
                            ...node,
                            label: action.payload.name
                        }
                    }
                    else {
                        return node
                    }
                }),
                edges: state.edges.map((edge) => {
                    if (edge.from == action.payload.id) {
                        return {
                            ...edge,
                            from_label: action.payload.name
                        }
                    }
                    else if (edge.to == action.payload.id) {
                        return {
                            ...edge,
                            to_label: action.payload.name
                        }
                    }
                    else {
                        return edge
                    }
                }),
                // parentOptions: [...action.payload.parentOptions],
                // childrenOptions: [...action.payload.childrenOptions]
            }
            return newOntology
        }
        // /////////////////////////////////////////////////////////////////////////////
        case "triggerLoadingAddSynset": {
            let newOntology = {
                ...state,
                "loadingAddNode": !state.loadingAddNode
            }
            return newOntology
        }
        case "triggerLoadingDeleteNode": {
            let newOntology = {
                ...state,
                "loadingDeleteNode": !state.loadingDeleteNode
            }
            return newOntology
        }
        case "triggerLoadingAddParentEdge": {
            let newOntology = {
                ...state,
                "loadingAddParentEdge": !state.loadingAddParentEdge
            }
            return newOntology
        }
        case "triggerLoadingAddChildrenEdge": {
            let newOntology = {
                ...state,
                "loadingAddChildrenEdge": !state.loadingAddChildrenEdge
            }
            return newOntology
        }
        case "triggerLoadingDeleteParentEdge": {
            let newOntology = {
                ...state,
                "loadingDeleteParentEdge": !state.loadingDeleteParentEdge
            }
            return newOntology
        }
        case "triggerLoadingUpdateNodeName": {
            let newOntology = {
                ...state,
                "loadingUpdateNodeName": !state.loadingUpdateNodeName
            }
            return newOntology
        }
        case "triggerLoadingDownload": {
            let newOntology = {
                ...state,
                "loadingUpdateNodeName": !state.loadingUpdateNodeName
            }
            return newOntology
        }
        case "triggerLoadingRenameOntology": {
            let newOntology = {
                ...state,
                "loadingRenameOntology": !state.loadingRenameOntology
            }
            return newOntology
        }
        default: {
            return action.payload
        }
    }
}

const OntologyProvider = (props) => {
    const [ontology, dispatchOntology] = useReducer(ontologyReducer, {
        "ontologyName": "",
        "url": "",
        "ontologyId": "",
        "nodes": [],
        "edges": [],
        "parentOptions": [],
        "childrenOptions": [],
        "loadingAddNode": false,
        "loadingAddSynset": false,
        "loadingAddParentEdge": false,
        "loadingAddChildrenEdge": false,
        "loadingDeleteNode": false,
        "loadingDeleteParentEdge": false,
        "loadingUpdateNodeName": false,
        "loadingDownload": false,
        "loadingRenameOntology": false
    })
    return (
        <OntologyContext.Provider value={[ontology, dispatchOntology]}>
            {props.children}
        </OntologyContext.Provider>
    )
}

export { OntologyProvider }
export default OntologyContext