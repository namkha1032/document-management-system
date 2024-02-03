import { useContext } from 'react';
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
import GridListContext from '../../context/GridListContext';
const Bread = (props) => {
    let [gridList, dispatchGridList] = useContext(GridListContext)
    console.log('gridList: ', gridList)
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
                    value={gridList}
                    onChange={(value) => dispatchGridList({ type: value })}
                    options={[
                        {
                            value: 'list',
                            icon: <BarsOutlined />
                        },
                        {
                            value: 'grid',
                            icon: <AppstoreOutlined />
                        },
                    ]}
                />

            </div>
        </div >
    )
}

export default Bread