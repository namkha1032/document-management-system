import { createContext, useReducer, useEffect } from "react";

let UserContext = createContext(null)
function userReducer(state, action) {
    switch (action.type) {
        case "login": {
            localStorage.setItem("user", JSON.stringify(action.payload))
            return action.payload
        }
        case "logout": {
            localStorage.removeItem("user")
            return null
        }
        case "updateInfo": {
            let oldItem = JSON.parse(localStorage.getItem("user"))
            let newItem = {
                ...oldItem,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name
            }
            localStorage.setItem("user", JSON.stringify(newItem))
            return newItem
        }
        default: {
            localStorage.removeItem("user")
            return null
        }
    }
}

const UserProvider = (props) => {
    // let userStorage = localStorage.getItem("user")
    const [user, dispatchUser] = useReducer(userReducer, null)
    return (
        <UserContext.Provider value={[user, dispatchUser]}>
            {props.children}
        </UserContext.Provider>
    )
}

export { UserProvider }
export default UserContext