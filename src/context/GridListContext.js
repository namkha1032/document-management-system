import { createContext, useReducer, useEffect } from "react";

let GridListContext = createContext(null)
function gridListReducer(state, action) {
    switch (action.type) {
        case "grid": {
            localStorage.setItem("gridList", "grid")
            return "grid"
        }
        case "list": {
            localStorage.setItem("gridList", "list")
            return "list"
        }
        default: {
            localStorage.setItem("gridList", "grid")
            return "grid"
        }
    }
}

const GridListProvider = (props) => {
    let gridListStorage = localStorage.getItem("gridList")
    const [gridList, dispatchGridList] = useReducer(gridListReducer, gridListStorage == 'list' ? 'list' : 'grid')
    useEffect(() => {
        if (gridListStorage == "list") {
            localStorage.setItem("gridList", "grid")
            dispatchGridList({ type: "list" })
        }
        else {
            localStorage.setItem("gridList", "grid")
            dispatchGridList({ type: "grid" })
        }
    }, [])
    return (
        <GridListContext.Provider value={[gridList, dispatchGridList]}>
            {props.children}
        </GridListContext.Provider>
    )
}

export { GridListProvider }
export default GridListContext