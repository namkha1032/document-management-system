import { createContext, useReducer, useEffect } from "react";

let UploadDocumentContext = createContext(null)
function UploadDocumentReducer(state, action) {
    switch (action.type) {
        case "addItem": {
            // return state.concat({
            //     fileList: [],
            //     fileUrl: [],
            //     current: 0,
            //     metadata: null,
            //     modalOpen: true,
            //     uploadType: action.payload.uploadType
            // })
            return [
                ...state,
                {
                    fileList: [],
                    fileUrl: [],
                    current: 0,
                    metadata: null,
                    modalOpen: true,
                    uploadType: action.payload.uploadType
                }
            ]
        }
        case "removeItem": {
            let newState = state.filter((item, index) => index != action.payload.index)
            return newState
        }
        case "openModal": {
            let newState = state.map((item, index) => index != action.payload.index ? item : {
                ...state[action.payload.index],
                modalOpen: true,
            })
            return newState
        }
        case "closeModal": {
            let newState = state.map((item, index) => index != action.payload.index ? item : {
                ...state[action.payload.index],
                modalOpen: false,
            })
            return newState
        }
        case "setFile": {
            let newState = state.map((item, index) => index != action.payload.index ? item : {
                ...state[action.payload.index],
                fileList: action.payload.fileList,
                fileUrl: action.payload.fileUrl
            })
            return newState
        }
        case "setStep": {
            let newState = state.map((item, index) => index != action.payload.index ? item : {
                ...state[action.payload.index],
                current: action.payload.current
            })
            return newState
        }
        case "setResult": {
            let newState = state.map((item, index) => index != action.payload.index ? item : {
                ...state[action.payload.index],
                current: 2,
                metadata: action.payload.metadata
            })
            return newState
        }
        case "editMetadata": {
            let newState = state.map((item, index) => index != action.payload.index ? item : {
                ...state[action.payload.index],
                metadata: action.payload.metadata
            })
            return newState
        }
        case "reset": {
            return []
        }
        default: {
            return []
        }
    }
}

const UploadDocumentProvider = (props) => {
    // {
    //     fileList: [],
    //     fileUrl: [],
    //     current: 0,
    //     metadata: null,
    //     modalOpen: false,
    //     uploadType: null
    // }
    const [uploadDocument, dispatchUploadDocument] = useReducer(UploadDocumentReducer, [])

    return (
        <UploadDocumentContext.Provider value={[uploadDocument, dispatchUploadDocument]}>
            {props.children}
        </UploadDocumentContext.Provider>
    )
}

export { UploadDocumentProvider }
export default UploadDocumentContext