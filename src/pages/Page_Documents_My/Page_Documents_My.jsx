import { Typography } from "antd"
import Bread from "../../components/Bread/Bread"
import DocumentFeed from "../../components/DocumentFeed/DocumentFeed"
import { useState, useEffect, useContext } from "react"
import { apiGetMyDocument } from "../../apis/documentApi";
import UserContext from '../../context/UserContext';
import DocumentMyContext from "../../context/DocumentMyContext";
const Page_Documents_My = () => {
    let [user, dispatchUser] = useContext(UserContext)
    let [documentMy, dispatchDocumentMy] = useContext(DocumentMyContext)
    let userStorage = JSON.parse(localStorage.getItem("user"))
    console.log("Page_Documents_My: documentMy", documentMy)
    useEffect(() => {
        async function fetchData() {
            let response = await apiGetMyDocument(userStorage.access_token, documentMy.current, documentMy.pageSize);
            dispatchDocumentMy({
                type: "set", payload: {
                    ...documentMy,
                    documents: response.documents,
                    current: response.current_page,
                    pageSize: response.page_size,
                    total: response.total_items,
                    totalPage: response.total_pages
                }
            });
        }
        fetchData()
        document.title = "My documents"
    }, [])
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread breadProp={[{ "title": "My documents", "path": "/my-documents" }]} createButtonType={"document"} />
            </div>
            <DocumentFeed
                originTitle={"My documents"}
                originPath={"my-documents"}
                documentResult={documentMy}
                dispatchDocumentResult={dispatchDocumentMy}
                getDocumentsApi={apiGetMyDocument}
            />
        </div>
    )
}

export default Page_Documents_My