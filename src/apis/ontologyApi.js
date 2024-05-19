import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
export async function getAllOntologies() {
    let response = await axios.get(`${endpoint}/api/ontology/all`, { headers: { ...originHeader } })
    return response.data.data
}
export async function getAllOntologiesNew() {
    let response = await axios.get(`${endpoint}/api/ontology/ontologyall`, { headers: { ...originHeader } })
    console.log("All ontologies", response)
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

export async function apiAddSynset(data) {
    let response = await axios.post(`${endpoint}/api/ontology/addsynset`, data, { headers: { ...originHeader } })
    return response.data.data
}

export async function apiUpdateDefinition(synsetId, data) {
    let response = await axios.patch(`${endpoint}/api/ontology/synsetdefinition/${synsetId}`, data, { headers: { ...originHeader } })
    return response.data.data
}

export async function apiAddSense(data) {
    let response = await axios.post(`${endpoint}/api/ontology/addsense`, data, { headers: { ...originHeader } })
    return response.data.data
}

export async function deleteNode(nodeId) {
    let response = await axios.delete(`${endpoint}/api/ontology/node/${nodeId}`, { headers: { ...originHeader } })
    return response.data.data
}

export async function apiUpdateSenseLabel(senseId, data) {
    let response = await axios.patch(`${endpoint}/api/ontology/sense/${senseId}`, data, { headers: { ...originHeader } })
    return response.data.data
}

export async function apiAddEdge(data) {
    let response = await axios.post(`${endpoint}/api/ontology/addedge`, data, { headers: { ...originHeader } })
    return response.data.data
}

export async function apiAddSynEdge(data) {
    let response = await axios.post(`${endpoint}/api/ontology/addsynedge`, data, { headers: { ...originHeader } })
    return response.data.data
}

export async function apiDeleteEdge(edge_id, ontology_id) {
    let response = await axios.delete(`${endpoint}/api/ontology/deledge/${edge_id}/${ontology_id}`, { headers: { ...originHeader } })
    return response.data.data
}

export async function uploadOntologyFile(formData) {
    let response = await axios.post(`${endpoint}/api/ontology/create/file`, formData, { headers: { ...originHeader } })
    return response.data.data
}

export async function createNewOntology(body) {
    let response = await axios.post(`${endpoint}/api/ontology/create/new`, body, { headers: { ...originHeader } })
    return response.data.data
}

export async function graphToTree(ontology_graph) {
    let response = await axios.post(`${endpoint}/api/ontology/download`, ontology_graph, { headers: { ...originHeader } })
    return response.data.data
}

export async function apiRenameOntology(ontologyId, data) {
    let response = await axios.patch(`${endpoint}/api/ontology/ontorename/${ontologyId}`, data, { headers: { ...originHeader } })
    return response.data.data
}

// //////////////////////////////////////////////////////////////////////////////////////


export async function getOntologyId(ontologyId) {
    let response = await axios.get(`${endpoint}/api/ontology/ontologyid/${ontologyId}`, { headers: { ...originHeader } })
    console.log("ontologyResponse", response)
    return response.data.data
}