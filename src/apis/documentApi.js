import axios from "axios";
import delay from "../functions/delay";
import { AiFillDatabase } from "react-icons/ai";
import endpoint from "./endpoint";
import { originHeader } from "./endpoint";
export async function getDocument(token, documentId) {
    let response = await axios.get(`${endpoint}/api/documents/detail/${documentId}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    return response.data.data
}

export async function getCompanyDocument(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function getMyDocuments(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix/me?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function getSharedDocuments(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix/shared?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function extractMetadata(newForm) {
    // await delay(2000)
    const rawResponse = await axios.post(`${endpoint}/api/ocr`, newForm, {
        headers: {
            ...originHeader
        }
    })
    console.log("rawResponse", rawResponse)
    // const rawResponse = await axios.get('http://localhost:3000/data/metadata.json')
    return rawResponse.data.data
}

export async function saveDocumentToCloud(token, data) {
    // await delay(1000)
    console.log("token: ", token)
    console.log("data: ", data)
    const rawResponse = await axios.post(`${endpoint}/api/documents/create`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    // return 1
    console.log("rawResponse in saveDocument: ", rawResponse)
    return rawResponse.data
}