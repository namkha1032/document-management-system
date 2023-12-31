import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    Html5TwoTone,
    CloudTwoTone,
    CompassTwoTone,
    Html5Outlined,
    Html5Filled,
    RightOutlined,
    SlidersOutlined,
    SearchOutlined,
    UserOutlined,
    TeamOutlined,
    DeleteOutlined,
    BarsOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Typography,
    Switch,
    Input,
    Flex,
    Button,
    Collapse,
    Row,
    Col,
    Avatar,
    Segmented,
    Card
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import FolderTree from '../components/FolderTree/FolderTree';
import "./PageTest.css"
// //////////////////////////////////////////////////////
const { Text, Title, Paragraph } = Typography
const { Header, Content, Footer, Sider } = Layout;
const PageTest = () => {

    let cardArray = []
    for (let i = 0; i < 12; i++) {
        cardArray.push(
            <Col md={4}>
                <Card
                    title="Default size card"
                // style={{
                //     width: 300,
                // }}
                >
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            </Col>
        )
    }
    return (
        <>
            <Typography.Text>hehehe</Typography.Text>
            <Row gutter={[16, 16]}>
                {cardArray}
            </Row>
        </>
    )
};
export default PageTest;