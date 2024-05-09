import { createContext, useReducer, useEffect } from "react";

let DocumentTrashContext = createContext(null)
function documentTrashReducer(state, action) {
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
        default: {
            return null
        }
    }
}

const DocumentTrashProvider = (props) => {
    const [documentTrash, dispatchDocumentTrash] = useReducer(documentTrashReducer, {
        documents: null,
        current: 1,
        pageSize: 24,
        total: null,
        totalPage: null,
        loading: false
    })
    return (
        <DocumentTrashContext.Provider value={[documentTrash, dispatchDocumentTrash]}>
            {props.children}
        </DocumentTrashContext.Provider>
    )
}

export { DocumentTrashProvider }
export default DocumentTrashContext