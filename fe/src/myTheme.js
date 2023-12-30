import { theme } from "antd"
import { useSearchParams } from "react-router-dom"
let params = (new URL(document.location)).searchParams;
let name = params.get("theme");
const myTheme = {
    // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    algorithm: theme.darkAlgorithm
}


export default myTheme