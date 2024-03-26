import { createContext, useReducer, useEffect } from "react";

let UploadDocumentContext = createContext(null)
function UploadDocumentReducer(state, action) {
    switch (action.type) {
        case "addFile": {
            return {
                ...state,
                fileList: [
                    ...state.fileList,
                    action.payload
                ]
            }
        }
        case "setFile": {
            return {
                ...state,
                fileList: action.payload.fileList,
                fileUrl: action.payload.fileUrl
            }
        }
        case "setStep": {
            return {
                ...state,
                current: action.payload
            }
        }
        case "setResult": {
            return {
                ...state,
                current: 2,
                metadata: action.payload
            }
        }
        case "reset": {
            return {
                fileList: [],
                fileUrl: [],
                current: 0,
                metadata: null
            }
        }
        default: {
            localStorage.removeItem("user")
            return null
        }
    }
}

const UploadDocumentProvider = (props) => {
    const [uploadDocument, dispatchUploadDocument] = useReducer(UploadDocumentReducer, {
        fileList: [],
        fileUrl: [],
        current: 0,
        metadata: null
    })

    return (
        <UploadDocumentContext.Provider value={[uploadDocument, dispatchUploadDocument]}>
            {props.children}
        </UploadDocumentContext.Provider>
    )
}

export { UploadDocumentProvider }
export default UploadDocumentContext