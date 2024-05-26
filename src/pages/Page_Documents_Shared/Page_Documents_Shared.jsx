import { Typography } from "antd"
import Bread from "../../components/Bread/Bread"
import DocumentFeed from "../../components/DocumentFeed/DocumentFeed"
import { useState, useEffect, useContext } from "react"
import { apiGetSharedDocument } from "../../apis/documentApi";
import UserContext from '../../context/UserContext';
import DocumentSharedContext from "../../context/DocumentSharedContext";
const Page_Documents_Shared = () => {
    let [user, dispatchUser] = useContext(UserContext)
    let [documentShared, dispatchDocumentShared] = useContext(DocumentSharedContext)
    let userStorage = JSON.parse(localStorage.getItem("user"))
    console.log("Page_Documents_My: documentShared", documentShared)
    useEffect(() => {
        async function fetchData() {
            let response = await apiGetSharedDocument(userStorage.access_token, documentShared.current, documentShared.pageSize);
            dispatchDocumentShared({
                type: "set", payload: {
                    ...documentShared,
                    documents: response.documents,
                    current: response.current_page,
                    pageSize: response.page_size,
                    total: response.total_items,
                    totalPage: response.total_pages
                }
            });
        }
        fetchData()
        document.title = "Shared documents"
    }, [])
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread breadProp={[{ "title": "Shared documents", "path": "/shared-documents" }]} createButtonType={"document"} />
            </div>
            <DocumentFeed
                originTitle={"Shared documents"}
                originPath={"shared-documents"}
                documentResult={documentShared}
                dispatchDocumentResult={dispatchDocumentShared}
                getDocumentsApi={apiGetSharedDocument}
            />
        </div>
    )
}

export default Page_Documents_Shared