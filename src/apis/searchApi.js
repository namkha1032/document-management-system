import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
export async function getSearchResult(searchData) {
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
    console.log("searchData", searchData)
    const response1 = await axios.get('http://localhost:3000/data/searchresult.json')
    let responseFake = await axios.get(`${endpoint}/api/documents/matrix/me?page=${searchData.current}&page_size=${searchData.pageSize}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("responseFake", responseFake)
    let newResponseFake = {
        broader: response1.data.data.broader,
        related: response1.data.data.related,
        narrower: response1.data.data.narrower,
        documents: responseFake.data.data.documents,
        current: searchData.current,
        pageSize: responseFake.data.data.page_size,
        total: responseFake.data.data.total_items,
    }
    return newResponseFake
    // ---------------------------------real-------------------------------------------
    // console.log("token", token)
    // console.log("searchData", searchData)
    // const response = await axios.post(`${endpoint}/api/search?page=1&page_size=10`, searchData, {
    //     headers: {
    //         "Authorization": `Bearer ${token}`,
    //         ...originHeader
    //     }
    // })
    // console.log("search result", response)
    // let newResponse = {
    //     ...response.data.data,
    //     documents: response.data.data.search_result.documents,
    //     current: response.data.data.search_result.current_page,
    //     pageSize: response.data.data.search_result.page_size,
    //     total: response.data.data.search_result.total_items,
    // }
    // return newResponse
}
