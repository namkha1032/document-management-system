import axios from "axios";
import delay from "../functions/delay";
import { AiFillDatabase } from "react-icons/ai";
import endpoint from "./endpoint";

export async function getDocument(token, documentId) {
    let response = await axios.get(`${endpoint}/api/documents/detail/${documentId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data.data
}

export async function getCompanyDocument(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function getMyDocuments(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix/me?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function getSharedDocuments(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix/shared?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function extractMetadata(newForm) {
    await delay(20000)
    // const rawResponse = await axios.post(`https://f637-2402-800-6370-9187-a4ff-1ff8-9f7f-2fb1.ngrok-free.app/api/ocr?template_type=${template}`, newForm)
    const rawResponse = await axios.get('http://localhost:3000/data/metadata.json')
    return rawResponse.data
}

export async function saveDocumentToCloud(token, data) {
    // await delay(1000)
    console.log("token: ", token)
    console.log("data: ", data)
    const rawResponse = await axios.post(`${endpoint}/api/documents/create`, data, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    // return 1
    console.log("rawResponse in saveDocument: ", rawResponse)
    return rawResponse.data
}