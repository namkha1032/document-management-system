import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./endpoint";
export async function getAllOntologies() {
    let response = await axios.get(`${endpoint}/api/ontology/all`)
    return response.data.data
}

export async function getOntology(ontologyUrl) {
    let response = await axios.get(`${endpoint}/api/ontology/one/${ontologyUrl}`)
    return response.data.data
}

export async function deleteOntology(ontologyId) {
    let response = await axios.delete(`${endpoint}/api/ontology/deleteonto/${ontologyId}`)
    return response.data.data
}

export async function addNewNode(newNode) {
    let response = await axios.post(`${endpoint}/api/ontology/node`, newNode)
    return response.data.data
}

export async function deleteNode(nodeId) {
    let response = await axios.delete(`${endpoint}/api/ontology/node/${nodeId}`)
    return response.data.data
}

export async function updateNodeName(nodeId, nodeName) {
    let response = await axios.patch(`${endpoint}/api/ontology/node/${nodeId}`, nodeName)
    return response.data.data
}

export async function addEdge(request) {
    let response = await axios.post(`${endpoint}/api/ontology/edge`, request)
    return response.data.data
}

export async function deleteEdge(edge_id) {
    let response = await axios.delete(`${endpoint}/api/ontology/edge/${edge_id}`)
    return response.data.data
}

export async function uploadOntologyFile(formData) {
    let response = await axios.post(`${endpoint}/api/ontology/create/file`, formData)
    return response.data.data
}

export async function createNewOntology(name) {
    let response = await axios.post(`${endpoint}/api/ontology/create/scratch`, name)
    return response.data.data
}

export async function graphToTree(ontology_graph) {
    let response = await axios.post(`${endpoint}/api/ontology/download`, ontology_graph)
    return response.data.data
}

export async function renameOntology(ontologyId, ontologyName) {
    let response = await axios.patch(`${endpoint}/api/ontology/renameonto/${ontologyId}`, ontologyName)
    return response.data.data
}