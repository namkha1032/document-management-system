import { createContext, useReducer, useEffect } from "react";

let SearchOptionContext = createContext(null)
function SearchOptionReducer(state, action) {
    switch (action.type) {
        case "update": {
            console.log('searchOption in context', action.payload)
            return action.payload
        }
    }
}

const SearchOptionProvider = (props) => {
    const [searchOption, dispatchSearchOption] = useReducer(SearchOptionReducer,
        {
            original_query: '',
            broader: {},
            related: {},
            narrower: {},
            metadata: [],
            method: 'fulltext',
            domain: 'legal',
            pagination: {
                current: 1,
                pageSize: 10,
            },
            search_scope: 'all'
        }
    )

    return (
        <SearchOptionContext.Provider value={[searchOption, dispatchSearchOption]}>
            {props.children}
        </SearchOptionContext.Provider>
    )
}

export { SearchOptionProvider }
export default SearchOptionContext