import axios from "axios";
import delay from "../functions/delay";

const domain = 'http://localhost:3000'
async function getSearchResult(searchData) {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
    await delay(1000)
    const result = await axios.get(`${domain}/data/searchresult.json`)
    return result.data
}

export { getSearchResult }