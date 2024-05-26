import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
export async function userLogin(credential) {
    // await delay(2000)
    let response = await axios.post(`${endpoint}/api/users/login`, credential, {
        headers: { ...originHeader }
    })
    return response.data.data
}

export async function getMe(token) {
    // await delay(2000)
    let response = await axios.get(`${endpoint}/api/users/get/me`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    return response.data.data
}

export async function apiUpdateInfo(data) {
    // await delay(2000)
    let token = JSON.parse(localStorage.getItem("user")).access_token
    let response = await axios.post(`${endpoint}/api/users/update/info`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    console.log("response info", response)
    return response.data.data
}
export async function apiLiveSearchUser(query) {
    // await delay(2000)
    let token = JSON.parse(localStorage.getItem("user")).access_token
    const queryParams = new URLSearchParams();
    queryParams.append("query", query);
    // let response = await axios.get(`/data/userlist.json`)
    let response = await axios.get(`${endpoint}/api/users/live-search-email?${queryParams.toString()}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    return response.data.data
}