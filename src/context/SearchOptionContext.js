import { createContext, useReducer, useEffect } from "react";
import { getAllOntologies, getAllOntologiesNew } from "../apis/ontologyApi";
let SearchOptionContext = createContext(null)
function SearchOptionReducer(state, action) {
    switch (action.type) {
        case "update": {
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
            allOntologies: [],
            current: 1,
            pageSize: 10,
            search_scope: 'all'
        }
    )
    useEffect(() => {
        async function fetchData() {
            let response = await getAllOntologiesNew()
            let oldSearchOption = JSON.parse(JSON.stringify(searchOption))
            dispatchSearchOption({
                type: "update",
                payload: {
                    ...oldSearchOption,
                    domainList: response,
                    allOntologies: response,
                    // domain: response[0]?.ontologyId,
                    // domainList: [],
                    // allOntologies: [],
                    domain: "1234"
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