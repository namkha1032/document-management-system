import { Typography } from "antd"
import Bread from "../../components/Bread/Bread"
import { useEffect } from "react"
const Page_Upload = () => {
    useEffect(() => {
        async function fetchData() {
            let raw = await fetch("http://localhost:3000/data/metadata.json")
            let data = await raw.json()
        }
        fetchData()
    }, [])
    return (
        <>
            <Bread title={"Upload new document"} />
            <Typography.Text>trung chanh</Typography.Text>
        </>
    )
}

export default Page_Upload