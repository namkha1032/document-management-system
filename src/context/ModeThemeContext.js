import { createContext, useReducer, useEffect } from "react";
import { ConfigProvider, theme } from 'antd';

let ModeThemeContext = createContext(null)
function modeThemeReducer(state, action) {
    switch (action.type) {
        case "light": {
            localStorage.setItem("modeTheme", "light")
            return "light"
        }
        case "dark": {
            localStorage.setItem("modeTheme", "dark")
            return "dark"
        }
        default: {
            localStorage.setItem("modeTheme", "light")
            return "light"
        }
    }
}

const ModeThemeProvider = (props) => {
    let modeThemeStorage = localStorage.getItem("modeTheme")
    const [modeTheme, dispatchModeTheme] = useReducer(modeThemeReducer, modeThemeStorage == 'dark' ? 'dark' : 'light')
    useEffect(() => {
        if (modeThemeStorage == "dark") {
            localStorage.setItem("modeTheme", "light")
            dispatchModeTheme({ type: "dark" })
        }
        else {
            localStorage.setItem("modeTheme", "light")
            dispatchModeTheme({ type: "light" })
        }
    }, [])
    const algo = {
        algorithm: modeTheme == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
    }
    return (
        <ModeThemeContext.Provider value={[modeTheme, dispatchModeTheme]}>
            <ConfigProvider theme={algo}>
                {props.children}
            </ConfigProvider>
        </ModeThemeContext.Provider>
    )
}

export { ModeThemeProvider }
export default ModeThemeContext