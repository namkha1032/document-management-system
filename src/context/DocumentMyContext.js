import { createContext, useReducer, useEffect } from "react";

let DocumentMyContext = createContext(null)
function documentMyReducer(state, action) {
    switch (action.type) {
        case "set": {
            return action.payload
        }
        case "pagination": {
            return {
                ...state,
                current: action.payload
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

const DocumentMyProvider = (props) => {
    const [documentMy, dispatchDocumentMy] = useReducer(documentMyReducer, {
        documents: null,
        current: 1,
        pageSize: 12,
        total: null,
        totalPage: null,
        loading: false
    })
    return (
        <DocumentMyContext.Provider value={[documentMy, dispatchDocumentMy]}>
            {props.children}
        </DocumentMyContext.Provider>
    )
}

export { DocumentMyProvider }
export default DocumentMyContext