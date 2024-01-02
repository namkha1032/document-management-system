import axios from "axios";
import delay from "../functions/delay";

const domain = 'http://localhost:3000'
async function getSearchResult(searchData) {
    await delay(2000)
    const result = await axios.get(`${domain}/data/searchresult.json`)
    return result.data
}

export { getSearchResult }