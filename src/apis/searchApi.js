import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
const domain = 'http://localhost:3000'
export async function getSearchResult(searchData) {
    let token = JSON.parse(localStorage.getItem("user")).access_token
    let newSearchData = {
        ...searchData,
        metadata: JSON.stringify(searchData.metadata)
    }
    await delay(1000)

    // ---------------------------------fake-------------------------------------------
    console.log("searchData", searchData)
    const response1 = await axios.get('http://localhost:3000/data/searchresult.json')
    let responseFake = await axios.get(`${endpoint}/api/documents/matrix/me?page=${searchData.pagination.current}&page_size=${searchData.pagination.pageSize}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("responseFake",responseFake)
    let newResponseFake = {
        ...response1.data.data,
        documents: responseFake.data.data.documents.map((doc, idx) => {
            return {
                document_id: doc.uid,
                file_name: doc.versions[0].file_name.length > 0 ? doc.versions[0].file_name.length : `document ${doc.uid}`,
                content: "",
                metadata: doc.versions[0].metadata,
                owner: {
                    full_name: `${doc.owner.first_name} ${doc.owner.last_name}`,
                    avatar: "/file/avatar.png"
                },
                file_size: "5 MB",
                created_date: doc.created_date,
                updated_date: doc.updated_date
            }
        }),
        pagination: {
            current: searchData.pagination.current,
            pageSize: responseFake.data.data.page_size,
            total: responseFake.data.data.total_items,
        }
    }
    return newResponseFake
    // ---------------------------------real-------------------------------------------
    // const response = await axios.post(`${endpoint}/api/search`, newSearchData, {
    //     headers: { ...originHeader }
    // })
    // console.log("responsesearch", response)
    const response = await axios.get('http://localhost:3000/data/searchresult.json')
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
