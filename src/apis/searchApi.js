import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
const domain = 'http://localhost:3000'
export async function getSearchResult(searchData) {
    let newSearchData = {
        ...searchData,
        metadata: JSON.stringify(searchData.metadata)
    }
    await delay(1000)
    // const response = await axios.post(`${endpoint}/api/search`, newSearchData, {
    //     headers: { ...originHeader }
    // })
    // console.log("responsesearch", response)
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
            ...response.data.data,
            documents: response.data.data.documents.slice(0, 10),
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
            ...response.data.data,
            documents: response.data.data.documents.slice(10),
            pagination: {
                current: 2,
                pageSize: 10,
                total: 15
            }
        }
        return newResponse
    }
}
