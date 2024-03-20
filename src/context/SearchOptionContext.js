import { createContext, useReducer, useEffect } from "react";
import { getAllOntologies } from "../apis/ontologyApi";
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
            domain: '',
            domainList: [],
            pagination: {
                current: 1,
                pageSize: 10,
            },
            search_scope: 'all'
        }
    )
    useEffect(() => {
        async function fetchData() {
            let response = await getAllOntologies()
            let oldSearchOption = JSON.parse(JSON.stringify(searchOption))
            dispatchSearchOption({
                type: "update",
                payload: {
                    ...oldSearchOption,
                    domainList: response,
                    domain: response[0].ontologyId
                }
            })
        }
        fetchData()
    }, [])
    return (
        <SearchOptionContext.Provider value={[searchOption, dispatchSearchOption]}>
            {props.children}
        </SearchOptionContext.Provider>
    )
}

export { SearchOptionProvider }
export default SearchOptionContext