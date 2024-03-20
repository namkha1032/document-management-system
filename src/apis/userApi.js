import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./endpoint";
import { originHeader } from "./endpoint";
export async function userLogin(credential) {
    // await delay(2000)
    let response = await axios.post(`${endpoint}/api/users/login`, credential, {
        headers: { ...originHeader }
    })
    console.log("responseLogin: ", response)
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