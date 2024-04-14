import axios from "axios";
import delay from "../functions/delay";
import { AiFillDatabase } from "react-icons/ai";
import endpoint from "./_domain";
import { originHeader } from "./_domain";

export async function apiGetDocument(documentId) {
    let token = JSON.parse(localStorage.getItem("user")).access_token
    await delay(100)
    let response = await axios.get(`${endpoint}/api/documents/detail/${documentId}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    return response.data.data
}

export async function apiGetCompanyDocument(token, page, page_size) {
    let response = await axios.get(`${endpoint}/api/documents/matrix?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    return response.data.data
}

export async function apiGetMyDocument(token, page, page_size) {
    let response = await axios.get(`${endpoint}/api/documents/matrix/me?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    return response.data.data
}

export async function apiGetSharedDocument(token, page, page_size) {
    let response = await axios.get(`${endpoint}/api/documents/matrix/shared?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })

    return response.data.data
}

export async function apiExtractMetadata(newForm) {
    await delay(4000)
    let rawResponse = null
    let i = 0
    while (rawResponse?.data?.data == null) {
        // rawResponse = await axios.post(`${endpoint}/api/ocr`, newForm, {
        //     headers: {
        //         ...originHeader
        //     }
        // })
        rawResponse = await axios.get(`http://localhost:3000/data/metadata.json`)
        if (rawResponse.data.data) {
            return rawResponse.data.data
        }
        i += 1
    }
    // const rawResponse = await axios.get('http://localhost:3000/data/metadata.json')
    // return rawResponse.data.data
}

export async function apiSaveDocumentToCloud(token, data) {
    // await delay(1000)
    let rawResponse = await axios.post(`${endpoint}/api/documents/create`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    // return 1
    return rawResponse.data
}

export async function apiUpdateMetadata(token, uid, data) {
    // await delay(2000)
    const rawResponse = await axios.post(`${endpoint}/api/documents/update/${uid}`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    // const rawResponse = await axios.get('http://localhost:3000/data/metadata.json')
    return rawResponse.data.data
}

export async function apiGrantPermission(data) {
    let token = JSON.parse(localStorage.getItem("user")).access_token
    let rawResponse = await axios.post(`${endpoint}/api/documents/grant`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    return rawResponse.data
}

export async function apiDeletePermission(data) {
    let token = JSON.parse(localStorage.getItem("user")).access_token
    let rawResponse = await axios.post(`${endpoint}/api/documents/ungrant`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    return rawResponse.data
}

export async function apiRestoreVersion(documentUid, versionUid) {
    let token = JSON.parse(localStorage.getItem("user")).access_token
    let rawResponse = await axios.post(`${endpoint}/api/documents/restore/${documentUid}/version/${versionUid}`, { fakeBody: "hehe" }, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    return rawResponse.data
}