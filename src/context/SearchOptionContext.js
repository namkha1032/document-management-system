import { createContext, useReducer, useEffect } from "react";
import { getAllOntologies, getAllOntologiesNew } from "../apis/ontologyApi";
let SearchOptionContext = createContext(null)
function SearchOptionReducer(state, action) {
    switch (action.type) {
        case "update": {
            return action.payload
        }
        case "reset": {
            return {
                original_query: '',
                broader: {},
                related: {},
                narrower: {},
                metadata: [],
                method: 'full-text',
                domain: '4:6189104e-54a2-4243-81ac-77508424ea24:0',
                // allOntologies: [],
                current: 1,
                pageSize: 10,
                search_scope: 'my'
            }
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
            method: 'full-text',
            domain: '4:6189104e-54a2-4243-81ac-77508424ea24:0',
            // allOntologies: [],
            current: 1,
            pageSize: 10,
            search_scope: 'my'
        }
    )
    // useEffect(() => {
    //     async function fetchData() {
    //         // let response = await getAllOntologiesNew()
    //         let oldSearchOption = JSON.parse(JSON.stringify(searchOption))
    //         dispatchSearchOption({
    //             type: "update",
    //             payload: {
    //                 ...oldSearchOption,
    //                 // allOntologies: response,
    //                 domain: "4:6189104e-54a2-4243-81ac-77508424ea24:0",
    //                 // allOntologies: [],
    //                 // domain: "abc"
    //             }
    //         })
    //     }
    //     fetchData()
    // }, [])
    return (
        <SearchOptionContext.Provider value={[searchOption, dispatchSearchOption]}>
            {props.children}
        </SearchOptionContext.Provider>
    )
}

export { SearchOptionProvider }
export default SearchOptionContext