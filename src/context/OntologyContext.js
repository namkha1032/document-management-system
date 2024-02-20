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
            let newOntology = JSON.parse(JSON.stringify({
                ...state,
                name: action.payload.name,
                url: action.payload.url,
                ontologyId: action.payload.ontologyId,
                nodes: [...action.payload.nodes],
                edges: [...action.payload.edges],
                childrenOptions: [...action.payload.childrenOptions],
                parentOptions: [...action.payload.parentOptions]
            }))
            return newOntology
        }
        case "addNode": {
            let newOntology = {
                ...state,
                nodes: [
                    ...state.nodes,
                    {
                        "id": action.payload.id,
                        "label": action.payload.label
                    }
                ],
                parentOptions: [...action.payload.parentOptions],
                childrenOptions: [...action.payload.childrenOptions]
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
                childrenOptions: [...action.payload.childrenOptions],
                parentOptions: [...action.payload.parentOptions]
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
                parentOptions: [...action.payload.parentOptions],
                childrenOptions: [...action.payload.childrenOptions]
            }
            return newOntology
        }
        case "addEdge": {
            let newOntology = {
                ...state,
                nodes: [...state.nodes],
                edges: [
                    ...state.edges,
                    {
                        "id": action.payload.id,
                        "from": action.payload.from,
                        "to": action.payload.to,
                        "from_label": action.payload.from_label,
                        "to_label": action.payload.to_label,
                    }
                ],
                childrenOptions: [...action.payload.childrenOptions],
                parentOptions: [...action.payload.parentOptions]
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
                childrenOptions: [...action.payload.childrenOptions],
                parentOptions: [...action.payload.parentOptions]
            }
            return newOntology
        }
        case "renameOntology": {
            let newOntology = {
                ...state,
                name: action.payload.name,
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
                parentOptions: [...action.payload.parentOptions],
                childrenOptions: [...action.payload.childrenOptions]
            }
            return newOntology
        }
        // /////////////////////////////////////////////////////////////////////////////
        case "triggerLoadingAddNode": {
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
        "name": "",
        "url": "",
        "ontologyId": "",
        "nodes": [],
        "edges": [],
        "parentOptions": [],
        "childrenOptions": [],
        "loadingAddNode": false,
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