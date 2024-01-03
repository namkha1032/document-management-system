import { Outlet, useNavigate } from 'react-router-dom';
import {
    AppstoreOutlined,
    BarsOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Layout,
    theme,
    Typography,
    Segmented,
    Button
} from 'antd';
import { useQueryClient } from '@tanstack/react-query';

const Bread = (props) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
                {props.title}
            </Typography.Title>
            <div style={{ display: "flex", alignItems: "center", columnGap: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} size={"large"}
                    onClick={() => {
                        queryClient.setQueryData(['sidebarItem'], 0)
                        navigate("/upload")
                    }}
                >
                    Upload
                </Button>
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
        </div >
    )
}

export default Bread