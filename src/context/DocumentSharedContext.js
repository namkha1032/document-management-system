import { createContext, useReducer, useEffect } from "react";

let DocumentSharedContext = createContext(null)
function documentSharedReduer(state, action) {
    switch (action.type) {
        case "set": {
            return action.payload
        }
        case "pagination": {
            return {
                ...state,
                current: action.payload.newPage,
                pageSize: action.payload.newPageSize
            }
        }
        case "loading": {
            return {
                ...state,
                loading: action.payload
            }
        }
        case "reset": {
            return {
                documents: null,
                current: 1,
                pageSize: 36,
                total: null,
                totalPage: null,
                loading: false
            }
        }
        default: {
            return null
        }
    }
}

const DocumentSharedProvider = (props) => {
    const [documentShared, dispatchDocumentShared] = useReducer(documentSharedReduer, {
        documents: null,
        current: 1,
        pageSize: 36,
        total: null,
        totalPage: null,
        loading: false
    })
    return (
        <DocumentSharedContext.Provider value={[documentShared, dispatchDocumentShared]}>
            {props.children}
        </DocumentSharedContext.Provider>
    )
}

export { DocumentSharedProvider }
export default DocumentSharedContext