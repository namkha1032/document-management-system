import Bread from "../../components/Bread/Bread"
import DocumentFeed from "../../components/DocumentFeed/DocumentFeed"
import { apiGetTrashDocument } from "../../apis/documentApi"
import { useContext, useEffect } from "react"
import DocumentTrashContext from "../../context/DocumentTrashContext"

const Page_Trash = () => {
    let [documentTrash, dispatchDocumentTrash] = useContext(DocumentTrashContext)
    let userStorage = JSON.parse(localStorage.getItem("user"))
    console.log("Page_Documents_Trash: documentTrash", documentTrash)
    useEffect(() => {
        async function fetchData() {
            let response = await apiGetTrashDocument(userStorage.access_token, documentTrash.current, documentTrash.pageSize);
            console.log("response", response)
            dispatchDocumentTrash({
                type: "set", payload: {
                    ...documentTrash,
                    documents: response.documents,
                    current: response.current_page,
                    pageSize: response.page_size,
                    total: response.total_items,
                    totalPage: response.total_pages
                }
            });
        }
        fetchData()
        document.title = "Trash"
    }, [])
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread breadProp={[{ "title": "Trash", "path": "/trash" }]} createButtonType={"document"} />
            </div>
            <DocumentFeed
                originTitle={"Trash"}
                originPath={"trash"}
                documentResult={documentTrash}
                dispatchDocumentResult={dispatchDocumentTrash}
                getDocumentsApi={apiGetTrashDocument}
            />
        </div>
    )
}
export default Page_Trash