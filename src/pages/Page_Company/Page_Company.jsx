import { Typography } from "antd"
import Bread from "../../components/Bread/Bread"
import DocumentFeed from "../../components/DocumentFeed/DocumentFeed"
import { useState, useEffect, useContext } from "react"
import { getCompanyDocument } from "../../apis/documentApi";
import UserContext from '../../context/UserContext';
const Page_Company = () => {
    let [user, dispatchUser] = useContext(UserContext)
    let [documents, setDocuments] = useState(null)
    let [page, setPage] = useState(1)
    let [pageSize, setPageSize] = useState(10)
    let userStorage = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        async function fetchData() {
            let response = await getCompanyDocument(userStorage.access_token, page, pageSize)
            // let newDocument = []
            // for (let i = 0; i < 50; i++) {
            //     newDocument = [
            //         ...newDocument,
            //         response.documents[0]
            //     ]
            // }
            // setDocuments(newDocument)
            setDocuments(response.documents)
        }
        fetchData()
    }, [])
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread breadProp={[{ "title": "Company documents", "path": "/company" }]} createButtonType={"document"} />
            </div>
            <DocumentFeed originTitle={"Company documents"} originPath={"company"} documents={documents} setDocuments={setDocuments} />
        </div>
    )
}

export default Page_Company