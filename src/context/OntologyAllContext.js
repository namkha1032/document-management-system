import { createContext, useReducer, useEffect } from "react";
import { getAllOntologies, getAllOntologiesNew } from "../apis/ontologyApi";
let OntologyAllContext = createContext(null)
function OntologyAllReducer(state, action) {
    switch (action.type) {
        case "update": {
            return action.payload
        }
    }
}

const OntologyAllProvider = (props) => {
    const [ontologyAll, dispatchOntologyAll] = useReducer(OntologyAllReducer, null)
    useEffect(() => {
        async function fetchData() {
            let response2 = await getAllOntologiesNew()
            dispatchOntologyAll({
                type: "update",
                payload: response2
            })
        }
        fetchData()
    }, [])
    return (
        <OntologyAllContext.Provider value={[ontologyAll, dispatchOntologyAll]}>
            {props.children}
        </OntologyAllContext.Provider>
    )
}

export { OntologyAllProvider }
export default OntologyAllContext