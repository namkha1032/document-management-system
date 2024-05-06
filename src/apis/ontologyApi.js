import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
export async function getAllOntologies() {
    let response = await axios.get(`${endpoint}/api/ontology/all`, { headers: { ...originHeader } })
    return response.data.data
}

export async function getOntology(ontologyUrl) {
    let response = await axios.get(`${endpoint}/api/ontology/one/${ontologyUrl}`, { headers: { ...originHeader } })
    console.log("ontologyUrl", response.data.data)
    return response.data.data
}

export async function deleteOntology(ontologyId) {
    let response = await axios.delete(`${endpoint}/api/ontology/deleteonto/${ontologyId}`, { headers: { ...originHeader } })
    return response.data.data
}

export async function addNewNode(newNode) {
    let response = await axios.post(`${endpoint}/api/ontology/node`, newNode, { headers: { ...originHeader } })
    return response.data.data
}

export async function deleteNode(nodeId) {
    let response = await axios.delete(`${endpoint}/api/ontology/node/${nodeId}`, { headers: { ...originHeader } })
    return response.data.data
}

export async function updateNodeName(nodeId, nodeName) {
    let response = await axios.patch(`${endpoint}/api/ontology/node/${nodeId}`, nodeName, { headers: { ...originHeader } })
    return response.data.data
}

export async function addEdge(request) {
    let response = await axios.post(`${endpoint}/api/ontology/edge`, request, { headers: { ...originHeader } })
    return response.data.data
}

export async function deleteEdge(edge_id) {
    let response = await axios.delete(`${endpoint}/api/ontology/edge/${edge_id}`, { headers: { ...originHeader } })
    return response.data.data
}

export async function uploadOntologyFile(formData) {
    let response = await axios.post(`${endpoint}/api/ontology/create/file`, formData, { headers: { ...originHeader } })
    return response.data.data
}

export async function createNewOntology(name) {
    let response = await axios.post(`${endpoint}/api/ontology/create/scratch`, name, { headers: { ...originHeader } })
    return response.data.data
}

export async function graphToTree(ontology_graph) {
    let response = await axios.post(`${endpoint}/api/ontology/download`, ontology_graph, { headers: { ...originHeader } })
    return response.data.data
}

export async function renameOntology(ontologyId, ontologyName) {
    let response = await axios.patch(`${endpoint}/api/ontology/renameonto/${ontologyId}`, ontologyName, { headers: { ...originHeader } })
    return response.data.data
}

// //////////////////////////////////////////////////////////////////////////////////////


export async function getOntologyId(ontologyId) {
    let response = await axios.get(`${endpoint}/api/ontology/ontologyid/${ontologyId}`, { headers: { ...originHeader } })
    console.log("response", response.data.data)
    return response.data.data
}