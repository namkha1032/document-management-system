import {
    Typography,
    Button,
    Image,
    Card,
    Form,
    Input,
    theme
} from "antd"
import {
    AppstoreOutlined,
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import ModeThemeContext from "../../context/ModeThemeContext";
import { userLogin, getMe } from "../../apis/userApi";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
const Page_Login = () => {
    let [loadingLogin, setLoadingLogin] = useState(false)
    let [user, dispatchUser] = useContext(UserContext)
    const antdTheme = theme.useToken()
    let loginColor = antdTheme.token.colorFill
    const navigate = useNavigate()
    async function handleLogin(values) {
        setLoadingLogin(true)
        console.log('Received values of form: ', values);
        try {
            let response = await userLogin(values)
            console.log("response: ", response)
            let userInfo = await getMe(response.access_token)
            let finalInfo = {
                ...userInfo,
                ...response
            }
            dispatchUser({ type: "login", payload: finalInfo })
            navigate(`/my-documents`)

        }
        catch (e) {
            console.log("error: ", e)
        }
        setLoadingLogin(false)
    };
    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url('/file/login.png')",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Card style={{
                width: "25%",
                boxShadow: "0px 0px 20px 1px",
                // opacity: "0.6",
                // backgroundColor: `${loginColor}`,
                // backgroundColor: `rgba(255,255,255,0.4)`,
                // backdropFilter: `blur(0px)`,
                // border: "0px"
            }}>
                <Typography.Title level={1} style={{
                    marginTop: 0,
                    textAlign: "center"
                }}>
                    Login
                </Typography.Title>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={handleLogin}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>

                    <Form.Item>
                        <Button loading={loadingLogin} type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
export default Page_Login