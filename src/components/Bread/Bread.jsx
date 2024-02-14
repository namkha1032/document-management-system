import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
    console.log("outer: ", props.breadProp)
    let [bread, setBread] = useState([])
    let [gridList, dispatchGridList] = useContext(GridListContext)
    const navigate = useNavigate()
    const { state } = useLocation();
    let breadState = state?.breadState
    let breadProp = props.breadProp
    useEffect(() => {
        let checkFlag = true
        for (let i = 0; i < bread.length; i++) {
            if (!bread[i].title) {
                break;
            }
            if (i == bread.length - 1) {
                checkFlag = false
            }
        }
        if (checkFlag) {
            if (breadState) {
                console.log("breadState in useEffect: ", breadState)
                setBread(breadState)
            }
            else {
                console.log("breadProp in useEffect: ", breadProp)
                setBread(breadProp)
            }
        }
    }, [breadProp])
    const queryClient = useQueryClient()
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                {bread.map((item, index) =>
                    <div key={index} style={{ display: "flex", alignItems: "center" }}>
                        <Button type='text' size='large' style={{ height: "fit-content", padding: 4 }} onClick={() => { navigate(item.path, { state: { breadState: bread.slice(0, index + 1) } }) }}>
                            <Typography.Title level={2} style={{ margin: 0 }}>
                                {item.title}
                            </Typography.Title>
                        </Button>
                        {index < bread.length - 1
                            ? <Typography.Title level={2} style={{ margin: 0 }}>
                                {">"}
                            </Typography.Title>
                            : null
                        }
                    </div>
                )}
            </div>
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