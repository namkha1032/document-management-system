import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";

export async function apiGetSearchResult(searchData) {
    let token = JSON.parse(localStorage.getItem("user")).access_token
    // let newSearchData = {
    //     ...searchData,
    //     metadata: JSON.stringify(searchData.metadata)
    // }
    // await delay(1000)

    // // ---------------------------------fakenew-------------------------------------------
    // console.log("searchData", searchData)
    // const response1 = await axios.get('http://localhost:3000/data/searchresult.json')
    // let responseFake = await axios.get(`http://localhost:3000/data/searchresult.json`, {
    //     headers: {
    //         "Authorization": `Bearer ${token}`,
    //         "ngrok-skip-browser-warning": "69420",
    //         ...originHeader
    //     }
    // })
    // console.log("responseFake", responseFake)
    // let newResponseFake = {
    //     broader: response1.data.data.broader,
    //     related: response1.data.data.related,
    //     narrower: response1.data.data.narrower,
    //     documents: responseFake.data.data.documents,
    //     current: searchData.current,
    //     pageSize: responseFake.data.data.page_size,
    //     total: responseFake.data.data.total_items,
    // }
    // return newResponseFake
    // // ---------------------------------fake-------------------------------------------
    // console.log("searchData", searchData)
    // const response1 = await axios.get('http://localhost:3000/data/searchresult.json')
    // let responseFake = await axios.get(`${endpoint}/api/documents/matrix/me?page=${searchData.current}&page_size=${searchData.pageSize}`, {
    //     headers: {
    //         "Authorization": `Bearer ${token}`,
    //         "ngrok-skip-browser-warning": "69420",
    //         ...originHeader
    //     }
    // })
    // console.log("responseFake", responseFake)
    // let newResponseFake = {
    //     broader: response1.data.data.broader,
    //     related: response1.data.data.related,
    //     narrower: response1.data.data.narrower,
    //     documents: responseFake.data.data.documents.map((doc, docidx) => {
    //         return {
    //             ...doc,
    //             versions: doc.versions.map((ver, verid) => {
    //                 return {
    //                     ...ver,
    //                     file_size: ver.file_size !== "" ? parseInt(ver.file_size) : 0,
    //                     file_name: ver.file_name.includes(".pdf") ? ver.file_name.split(".")[0] + ".pdf" : doc.uid
    //                 }
    //             })
    //         }
    //     }),
    //     current: searchData.current,
    //     pageSize: responseFake.data.data.page_size,
    //     total: responseFake.data.data.total_items,
    // }
    // return newResponseFake
    // ---------------------------------real-------------------------------------------
    console.log("token", token)
    console.log("searchData", searchData)
    let newSearchData = {
        ...searchData,
        method: searchData.method == "semantic" ? "semantic" : searchData.method == "file-name" ? "file-name" : "full-text",
        domain: searchData.method == "full-text" ? searchData.domain : ""
    }
    if (newSearchData.method == "semantic") {
        newSearchData["threshold"] = 0.5
    }
    const response = await axios.post(`${endpoint}/api/search?page=${newSearchData.current}&page_size=${newSearchData.pageSize}`, newSearchData, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    console.log("search result", response)
    let newResponse = {
        ...response.data.data,
        documents: response.data.data.search_result.documents.map((doc, docidx) => {
            return {
                ...doc,
                versions: doc.versions.map((ver, verid) => {
                    return {
                        ...ver,
                        file_size: ver.file_size !== "" ? parseInt(ver.file_size) : 0,
                        file_name: ver.file_name.includes(".pdf") ? ver.file_name.split(".")[0] + ".pdf" : doc.uid
                    }
                })
            }
        }),
        current: response.data.data.search_result.current_page,
        pageSize: response.data.data.search_result.page_size,
        total: response.data.data.search_result.total_items,
    }
    return newResponse
}
