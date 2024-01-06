import axios from "axios";
import delay from "../functions/delay";

const domain = 'http://localhost:3000'
async function getSearchResult(searchData) {
    console.log('----------------------------------------search----------------------------------------------------------')
    await delay(1000)
    const response = await axios.get(`${domain}/data/searchresult.json`, {
        params: searchData
    })
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

export { getSearchResult }