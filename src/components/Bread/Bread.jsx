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
    Button,
    Space,
    Divider
} from 'antd';
import GridListContext from '../../context/GridListContext';
import CreateOntology from '../CreateOntology/CreateOntology';
import CreateDocument from '../CreateDocument/CreateDocument';
const Bread = (props) => {
    const { state } = useLocation();
    let breadState = state?.breadState
    // -----------props-----------------
    let breadProp = props.breadProp
    let breadSelectedDoc = props.breadSelectedDoc
    let createButtonType = props.createButtonType
    let extraComponent = props.extraComponent
    // -----------props-----------------
    let [bread, setBread] = useState([])
    let [gridList, dispatchGridList] = useContext(GridListContext)
    const navigate = useNavigate()
    useEffect(() => {
        let checkFlag = true
        for (let i = 0; i < bread.length; i++) {
            if (!bread[i].title) {
                break;
            }
            if (i == bread.length - 1 && !breadProp[i].title) {
                checkFlag = false
            }
            if (i == bread.length - 1 && breadProp[i]?.title && breadProp[i]?.title !== bread[i]?.title) {
                setBread([bread[0], breadProp[i]])
                checkFlag = false
            }
            // if (i == 0 && breadProp[i]?.title && breadProp[i]?.title !== bread[i]?.title) {
            //     setBread(breadProp)
            //     checkFlag = false
            // }
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
            // if (breadProp) {
            //     console.log("breadProp in useEffect: ", breadProp)
            //     setBread(breadProp)
            // }
            // else if (breadState) {
            //     console.log("breadState in useEffect: ", breadState)
            //     setBread(breadState)
            // }
        }
        // setBread(breadProp)
    }, [breadProp])
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                {/* <div className='outerdiv' style={{ display: "flex", alignItems: "center" }}> */}
                <div>
                    <Space>
                        {bread.map((item, index) =>
                            // <div className='innerdiv' key={index} style={{ display: "flex", alignItems: "center" }}>
                            <Space key={index}>
                                <Button type='text' size='large' style={{
                                    height: "fit-content",
                                    padding: 4
                                }} onClick={() => {
                                    navigate(item.path, {
                                        state: {
                                            breadState: bread.slice(0, index + 1),
                                            breadSelectedDoc: breadSelectedDoc
                                        }
                                    })
                                }}>
                                    <Typography.Title level={2} style={{
                                        margin: 0,
                                        // fontWeight: index == bread.length - 1 ? 500 : "normal"
                                        fontWeight: 500,
                                        maxWidth: 800
                                    }}
                                        ellipsis>
                                        {item.title}
                                    </Typography.Title>
                                </Button>
                                {index < bread.length - 1
                                    ? <Typography.Title level={2} style={{
                                        margin: 0,
                                        // fontWeight: "normal"
                                        fontWeight: 500
                                    }}>
                                        {">"}
                                    </Typography.Title>
                                    : null
                                }
                            </Space>
                            // </div>
                        )}
                        {extraComponent}
                    </Space>
                </div>
                {/* </div> */}
                <Space>
                    {createButtonType == "ontology"
                        ? <CreateOntology />
                        : <CreateDocument />
                    }
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

                </Space>
            </div >
            {/* <Divider style={{ margin: 0 }} /> */}
        </>
    )
}

export default Bread