import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
const Unauthorized = () => {
    const navigate = useNavigate()
    return (
        <div style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button onClick={() => { navigate(`/company`) }} type="primary">Back Home</Button>}
            />
        </div>
    )
}
export default Unauthorized