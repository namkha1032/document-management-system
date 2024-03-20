import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./endpoint";
const domain = 'http://localhost:3000'
export async function getSearchResult(searchData) {
    let newSearchData = {
        ...searchData,
        metadata: JSON.stringify(searchData.metadata)
    }
    await delay(1000)
    // const response = await axios.post(`https://f637-2402-800-6370-9187-a4ff-1ff8-9f7f-2fb1.ngrok-free.app/api/search`, newSearchData)
    const response = await axios.get('http://localhost:3000/data/searchresult.json')
    // const newResponse = {
    //     ...response.data,
    //     pagination: {
    //         current: 1,
    //         pageSize: 10,
    //         total: 15
    //     }
    // }
    if (searchData.pagination.current == 1) {
        let newResponse = {
            ...response.data,
            documents: response.data.documents.slice(0, 10),
            pagination: {
                current: 1,
                pageSize: 10,
                total: 15
            }
        }
        return newResponse

    }
    else if (searchData.pagination.current == 2) {
        let newResponse = {
            ...response.data,
            documents: response.data.documents.slice(10),
            pagination: {
                current: 2,
                pageSize: 10,
                total: 15
            }
        }
        return newResponse
    }
}
