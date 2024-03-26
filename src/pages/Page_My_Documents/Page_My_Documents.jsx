import { Typography } from "antd"
import Bread from "../../components/Bread/Bread"
import DocumentFeed from "../../components/DocumentFeed/DocumentFeed"
import { useState, useEffect, useContext } from "react"
import { getMyDocuments } from "../../apis/documentApi";
import UserContext from '../../context/UserContext';
import DocumentMyContext from "../../context/DocumentMyContext";
import { convertToPng, convertToJpg } from "../../apis/documentApi";
const Page_My_Documents = () => {
    // console.log('---------------render Page_Company----------------')
    let [user, dispatchUser] = useContext(UserContext)
    let [documentMy, dispatchDocumentMy] = useContext(DocumentMyContext)
    let userStorage = JSON.parse(localStorage.getItem("user"))
    console.log("Page_My_Document: documentMy", documentMy)
    useEffect(() => {
        // async function fetchData() {
        //     let response = await getMyDocuments(userStorage.access_token, documentMy.current, documentMy.pageSize)
        //     let newDocuments = []
        //     for (let doc of response.documents) {
        //         let pngUrl = await convertToPng(doc.versions[0].url.length > 0 ? doc.versions[0].url : "/file/sample.pdf")
        //         let copyDoc = JSON.parse(JSON.stringify(doc))
        //         copyDoc = {
        //             ...copyDoc,
        //             image_file: pngUrl
        //         }
        //         newDocuments = [
        //             ...newDocuments,
        //             copyDoc
        //         ]
        //     }
        //     dispatchDocumentMy({
        //         type: "set", payload: {
        //             ...documentMy,
        //             documents: newDocuments,
        //             current: response.current_page,
        //             pageSize: response.page_size,
        //             total: response.total_items,
        //             totalPage: response.total_pages
        //         }
        //     })
        // }
        // async function fetchData() {
        //     let response = await getMyDocuments(userStorage.access_token, documentMy.current, documentMy.pageSize);
        //     let newDocuments = [];

        //     // Create an array of promises for each document conversion
        //     let conversionPromises = response.documents.map(async (doc, index) => {
        //         // console.log(`before ${index}`)
        //         // let pngUrl = await convertToJpg(doc.versions[0].url.length > 0 ? doc.versions[0].url : "/file/sample.pdf");
        //         // console.log(`after ${index}`)
        //         // let copyDoc = { ...doc, image_file: pngUrl };
        //         let copyDoc = { ...doc, image_file: '/file/sample.png' };
        //         newDocuments.push(copyDoc);
        //     });

        //     // Wait for all conversions to finish
        //     await Promise.all(conversionPromises);

        //     dispatchDocumentMy({
        //         type: "set", payload: {
        //             ...documentMy,
        //             documents: newDocuments,
        //             current: response.current_page,
        //             pageSize: response.page_size,
        //             total: response.total_items,
        //             totalPage: response.total_pages
        //         }
        //     });
        // }
        async function fetchData() {
            let response = await getMyDocuments(userStorage.access_token, documentMy.current, documentMy.pageSize);
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
                getDocumentsApi={getMyDocuments}
            />
        </div>
    )
}

export default Page_My_Documents