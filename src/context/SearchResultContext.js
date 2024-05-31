import { createContext, useReducer, useEffect } from "react";
// import api
let SearchResultContext = createContext(null)
function SearchResultReducer(state, action) {
    switch (action.type) {
        case "update": {
            return action.payload
        }
        case "search": {
            let newSearchResult = action.payload.newSearchResult
            let newSearchOption = action.payload.newSearchOption
            if (newSearchOption.method === "full-text"
                // && newSearchOption.oldQuery !== newSearchOption.original_query
            ) {
                return {
                    ...newSearchResult,
                    broader: newSearchResult.broader,
                    // related: Object.keys(newSearchResult.related).reduce((acc, key) => {
                    //     acc[key] = [];
                    //     return acc;
                    // }, {}),
                    related: newSearchResult.related,
                    narrower: newSearchResult.narrower
                }
            }
            // else if (newSearchOption.method === "full-text") {
            //     Object.entries(newSearchOption.broader).forEach(([oriTerm, extendArray], index) => {
            //         if (newSearchResult.broader.hasOwnProperty(oriTerm)) {
            //             extendArray.forEach((extendTerm, index) => {
            //                 newSearchResult = {
            //                     ...newSearchResult,
            //                     broader: {
            //                         ...newSearchResult.broader,
            //                         [oriTerm]: newSearchResult.broader[oriTerm].filter(newItem => newItem != extendTerm)
            //                     }
            //                 }
            //             })
            //         }
            //     })
            //     Object.entries(newSearchOption.related).forEach(([oriTerm, extendArray], index) => {
            //         if (newSearchResult.related.hasOwnProperty(oriTerm)) {
            //             extendArray.forEach((extendTerm, index) => {
            //                 newSearchResult = {
            //                     ...newSearchResult,
            //                     related: {
            //                         ...newSearchResult.related,
            //                         [oriTerm]: newSearchResult.related[oriTerm].filter(newItem => newItem != extendTerm)
            //                     }
            //                 }
            //             })
            //         }
            //     })
            //     Object.entries(newSearchOption.narrower).forEach(([oriTerm, extendArray], index) => {
            //         if (newSearchResult.narrower.hasOwnProperty(oriTerm)) {
            //             extendArray.forEach((extendTerm, index) => {
            //                 newSearchResult = {
            //                     ...newSearchResult,
            //                     narrower: {
            //                         ...newSearchResult.narrower,
            //                         [oriTerm]: newSearchResult.narrower[oriTerm].filter(newItem => newItem != extendTerm)
            //                     }
            //                 }
            //             })
            //         }
            //     })
            //     return newSearchResult
            // }
            else {
                return {
                    ...newSearchResult,
                    broader: {},
                    related: {},
                    narrower: {}
                }
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
                loading: false,
                documents: [],
                broader: {},
                related: {},
                narrower: {},
                // pagination: {
                //     total: null
                // },
                total: null
            }
        }
    }
}

const SearchResultProvider = (props) => {
    const [searchResult, dispatchSearchResult] = useReducer(SearchResultReducer,
        {
            loading: false,
            documents: [],
            broader: {},
            related: {},
            narrower: {},
            // pagination: {
            //     total: null
            // },
            total: null
        }
    )

    return (
        <SearchResultContext.Provider value={[searchResult, dispatchSearchResult]}>
            {props.children}
        </SearchResultContext.Provider>
    )
}

export { SearchResultProvider }
export default SearchResultContext