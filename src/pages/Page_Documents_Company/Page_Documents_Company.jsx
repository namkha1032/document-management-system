import { Typography } from "antd"
import Bread from "../../components/Bread/Bread"
import DocumentFeed from "../../components/DocumentFeed/DocumentFeed"
import { useState, useEffect, useContext } from "react"
import { apiGetCompanyDocument } from "../../apis/documentApi";
import UserContext from '../../context/UserContext';
import DocumentCompanyContext from "../../context/DocumentCompanyContext";
const Page_Documents_Company = () => {
    let [user, dispatchUser] = useContext(UserContext)
    let [documentCompany, dispatchDocumentCompany] = useContext(DocumentCompanyContext)
    let userStorage = JSON.parse(localStorage.getItem("user"))
    console.log("Page_Documents_Company: documentCompany", documentCompany)
    useEffect(() => {
        async function fetchData() {
            let response = await apiGetCompanyDocument(userStorage.access_token, documentCompany.current, documentCompany.pageSize);
            dispatchDocumentCompany({
                type: "set", payload: {
                    ...documentCompany,
                    documents: response.documents,
                    current: response.current_page,
                    pageSize: response.page_size,
                    total: response.total_items,
                    totalPage: response.total_pages
                }
            });
        }
        fetchData()
    }, [])
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread breadProp={[{ "title": "Company documents", "path": "/company" }]} createButtonType={"document"} />
            </div>
            <DocumentFeed
                originTitle={"Company documents"}
                originPath={"company"}
                documentResult={documentCompany}
                dispatchDocumentResult={dispatchDocumentCompany}
                getDocumentsApi={apiGetCompanyDocument}
            />
        </div>
    )
}

export default Page_Documents_Company