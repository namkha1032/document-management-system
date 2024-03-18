import { Typography } from "antd"
import Bread from "../../components/Bread/Bread"
import DocumentFeed from "../../components/DocumentFeed/DocumentFeed"
const Page_Company = () => {
    console.log('---------------render Page_Company----------------')
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: "0 1 auto" }}>
                <Bread breadProp={[{ "title": "Company documents", "path": "/company" }]} createButtonType={"document"} />
            </div>
            <DocumentFeed />
        </div>
    )
}

export default Page_Company