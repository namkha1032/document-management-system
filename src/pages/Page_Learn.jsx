import { DatePicker, Button, Space, message, Alert, Input } from "antd";
import { useState } from "react";
import { SearchOutlined, WalletTwoTone } from '@ant-design/icons';
import {
    Divider,
    Typography,
    Flex,
    Card,
    Grid,
    Row,
    Col
} from 'antd';

const { Title, Paragraph, Text, Link } = Typography;
const { useBreakpoint } = Grid
const desktop = 4
const tablet = 6
const phone = 8

const PageLearn = () => {
    const screen = useBreakpoint()
    const gutter = screen.md ? [30, 30] : (screen.sm ? [20, 20] : [10, 10])
    const [date, setDate] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const handleChange = (value) => {
        messageApi.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
        setDate(value);
    };
    const style = {
        background: '#0092ff',
        padding: '8px 0',
    };
    return (
        <div>
            <DatePicker onChange={handleChange} />
            <div style={{ marginTop: 16 }}>
                {/* Selected Date: {date ? date.format('YYYY-MM-DD') : 'None'} */}
                <Alert message="Selected Date" description={date ? date.format('YYYY-MM-DD') : 'None'} />
            </div>
            {contextHolder}
            <div style={{ marginTop: 16 }}>
                {/* <Space> */}
                <Flex gap={"small"} justify={"flex-end"}>
                    <Input style={{ width: 200 }} placeholder="Please Input" />
                    <Button shape="default" type="default" icon={<WalletTwoTone twoToneColor={"#f04fd0"} spin />} >
                        Submit
                    </Button>
                </Flex>
                {/* </Space> */}
            </div>
            <Typography>
                <Title>Introduction</Title>
                <Paragraph>
                    In the process of internal desktop applications development, many different design specs and
                    implementations would be involved, which might cause designers and developers difficulties and
                    duplication and reduce the efficiency of development.
                </Paragraph>
                <Paragraph>
                    After massive project practice and summaries, Ant Design, a design language for background
                    applications, is refined by Ant UED Team, which aims to{' '}
                    <Text strong>
                        uniform the user interface specs for internal background projects, lower the unnecessary
                        cost of design differences and implementation and liberate the resources of design and
                        front-end development
                    </Text>
                    .
                </Paragraph>
                <Title level={2}>Guidelines and Resources</Title>
                <Paragraph>
                    We supply a series of design principles, practical patterns and high quality design resources
                    (<Text code>Sketch</Text> and <Text code>Axure</Text>), to help people create their product
                    prototypes beautifully and efficiently.
                </Paragraph>

                <Paragraph>
                    <ul>
                        <li>
                            <Link href="/docs/spec/proximity">Principles</Link>
                        </li>
                        <li>
                            <Link href="/docs/spec/overview">Patterns</Link>
                        </li>
                        <li>
                            <Link href="/docs/resources">Resource Download</Link>
                        </li>
                    </ul>
                </Paragraph>

                <Paragraph>
                    Press <Text keyboard>Esc</Text> to exit...
                </Paragraph>

                <Divider />

            </Typography>
            <Paragraph type={screen.xs ? "success" : "danger"}>xs</Paragraph>
            <Paragraph type={screen.sm ? "success" : "danger"}>sm</Paragraph>
            <Paragraph type={screen.md ? "success" : "danger"}>md</Paragraph>
            <Paragraph type={screen.lg ? "success" : "danger"}>lg</Paragraph>
            <Paragraph type={screen.xl ? "success" : "danger"}>xl</Paragraph>
            <Paragraph type={screen.xxl ? "success" : "danger"}>xxl</Paragraph>
            <Row gutter={gutter} justify="space-between" align="middle">
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
                <Col md={desktop} sm={tablet} xs={phone}>
                    <div style={style}>namkha</div>
                </Col>
            </Row>
        </div>
    )
}

export default PageLearn