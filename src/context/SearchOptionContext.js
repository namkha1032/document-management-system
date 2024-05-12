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
            let response2 = await getAllOntologiesNew()
            console.log("allonto", response2)
            console.log("oldonto", response)
            let oldSearchOption = JSON.parse(JSON.stringify(searchOption))
            dispatchSearchOption({
                type: "update",
                payload: {
                    ...oldSearchOption,
                    domainList: response,
                    allOntologies: response2,
                    domain: response[0]?.ontologyId
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