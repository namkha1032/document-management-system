import { Outlet } from 'react-router-dom';
import {
    AppstoreOutlined,
    BarsOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Layout,
    theme,
    Typography,
    Segmented,
} from 'antd';
import { useQueryClient } from '@tanstack/react-query';

const Bread = () => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>My Documents</Breadcrumb.Item>
                <Breadcrumb.Item>Spider-Man</Breadcrumb.Item>
            </Breadcrumb>
            <Segmented
                options={[
                    {
                        value: 'List',
                        icon: <BarsOutlined />
                    },
                    {
                        value: 'Kanban',
                        icon: <AppstoreOutlined />
                    },
                ]}
            />
        </div>
    )
}

export default Bread