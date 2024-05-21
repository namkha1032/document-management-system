import { createContext, useReducer, useEffect } from "react";

let DocumentCompanyContext = createContext(null)
function documentCompanyReduer(state, action) {
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

const DocumentCompanyProvider = (props) => {
    const [documentCompany, dispatchDocumentCompany] = useReducer(documentCompanyReduer, {
        documents: null,
        current: 1,
        pageSize: 36,
        total: null,
        totalPage: null,
        loading: false
    })
    return (
        <DocumentCompanyContext.Provider value={[documentCompany, dispatchDocumentCompany]}>
            {props.children}
        </DocumentCompanyContext.Provider>
    )
}

export { DocumentCompanyProvider }
export default DocumentCompanyContext