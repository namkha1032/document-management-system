import {
    Typography,
    Button,
    Image,
    Card,
    Form,
    Input
} from "antd"
import {
    AppstoreOutlined,
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
const Page_Login = () => {
    const handleLogin = (values) => {
        console.log('Received values of form: ', values);
    };
    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url('https://preview.redd.it/fn0542d6gaw31.jpg?auto=webp&s=61dc4dffb31ef492ff08aa7aa19ab52c12b7cb56')",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Card style={{
                width: "30%",
                boxShadow: "0px 0px 50px 10px"
            }}>
                <Typography.Title level={1} style={{
                    marginTop: 0,
                    textAlign: "center"
                }}>
                    Login
                </Typography.Title>
                <Form
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={handleLogin}
                >
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
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
                    <Form.Item>
                        <a href="">
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
export default Page_Login