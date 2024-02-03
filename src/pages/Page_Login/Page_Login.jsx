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
const Page_Login = () => {
    const antdTheme = theme.useToken()
    let loginColor = antdTheme.token.colorFill
    const handleLogin = (values) => {
        console.log('Received values of form: ', values);
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
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
export default Page_Login