import { useState, useEffect } from "react";
import {
    Typography,
    Row,
    Col,
    Card,
    theme,
    Table,
    Avatar,
    Button,
    Statistic,
    Input,
    Modal,
    Skeleton,
    Divider,
    Space,
    Cascader,
    Select,
    Segmented,
    Tag
} from "antd"
import { useForm, Controller } from "react-hook-form"
// import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { CiShoppingTag } from "react-icons/ci";
import { AiFillSignal } from "react-icons/ai";
import {
    TagOutlined,
    ClockCircleOutlined,
    UngroupOutlined,
    CloseOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import { apiGrantPermission, apiDeletePermission } from "../../apis/documentApi";
import randomString from "../../functions/randomString";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getUserList } from "../../apis/userApi";

const PermissionUserList = (props) => {
    let permissionList = props.permissionList
    let document = props.document
    let setDocument = props.setDocument

    async function handleDeletePermission(email, document_uid) {
        console.log("email", email)
        console.log("document_uid", document_uid)
        let response = await apiDeletePermission({
            email: email,
            document_uid: document_uid
        })
        setDocument({
            ...document,
            users_with_permission: document.users_with_permission.filter((user, index) => user.email != email)
        })
        // console.log("response: ", response)
    }

    async function handleChangePermission(email, permission) {
        let responsePermission = await apiGrantPermission({
            email: email,
            document_uid: document.uid,
            permission: permission
        })
        setDocument({
            ...document,
            users_with_permission: document.users_with_permission.map((user, index) => {
                if (user.email == email) {
                    return {
                        ...user,
                        permission: permission
                    }
                }
                else {
                    return user
                }
            })
        })
    }
    return (
        <>
            {permissionList.map((oneUser, index) => {
                if (oneUser.email != JSON.parse(localStorage.getItem("user")).email) {
                    return (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Tag
                                icon={<Avatar size="small" src={`/file/avatar.png`} />}
                                closeIcon={<Button onClick={() => { handleDeletePermission(oneUser.email, document.uid) }} size="small" shape="circle" type="text" icon={<CloseOutlined />} />}
                                onClose={(e) => { console.log(e) }}
                                style={{ display: "flex", columnGap: 8, alignItems: "center", borderRadius: 100, height: 30, padding: 4 }}>
                                <Typography.Text style={{ fontSize: 16 }}>{oneUser.email}</Typography.Text>
                            </Tag>
                            <Select
                                variant="borderless"
                                size="large"
                                // style={{ width: "100%" }}
                                value={oneUser.permission}
                                onChange={(value, node) => { handleChangePermission(oneUser.email, value) }}
                                options={[
                                    {
                                        value: 'VIEW',
                                        label: "Can view",
                                    },
                                    {
                                        value: 'EDIT',
                                        label: "Can edit",
                                    }
                                ]}
                            />
                        </div>
                    )
                }
            })}
        </>
    )
}

const PermissionModal = (props) => {
    let document = props.document
    let setDocument = props.setDocument
    let modalButton = props.modalButton
    let [modalOpen, setModalOpen] = useState(false)
    let [userList, setUserList] = useState(null)
    let [permissionType, setPermissionType] = useState("VIEW")
    let [permissionCurrent, setPermissionCurrent] = useState("ALL")
    let [selectedUser, setSelectedUser] = useState(null)
    console.log("selectedUser", selectedUser)

    useEffect(() => {
        async function fetchData() {
            let response = await getUserList()
            let newUserList = response.map((item, index) => {
                return {
                    "value": item.email,
                    "label": <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <Avatar size={"small"} src={`/file/avatar.png`} />
                        <Typography.Text>{item.email}</Typography.Text>
                    </div>
                }
            })
            setUserList(newUserList)
        }
        fetchData()
    }, [])
    console.log("document in modal", document)
    async function handleAddPermission() {
        let responsePermission = await apiGrantPermission({
            email: selectedUser,
            document_uid: document.uid,
            permission: permissionType
        })
        setDocument({
            ...document,
            users_with_permission: [
                ...document.users_with_permission,
                {
                    email: selectedUser,
                    permission: permissionType
                }
            ]
        })
        setSelectedUser(null)
    }
    return (
        <>
            <Modal footer={null} style={{ top: 100 }}
                title={<>
                    <Typography.Title style={{ margin: 0 }} level={4}>Share document</Typography.Title>
                    <Typography.Text type="secondary">Share your document to collaborate with your team</Typography.Text>
                    <Divider />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space style={{ width: "80%" }}>
                            <FontAwesomeIcon icon={icon({ name: 'file-pdf', family: 'classic', style: 'solid' })} style={{ color: "#e2574c", fontSize: 36 }} />
                            <Typography.Text ellipsis={{ tooltip: document?.versions[0].file_name.length > 0 ? document?.versions[0].file_name : document?.uid }}
                                style={{ fontSize: 18, width: "80%", fontWeight: 600 }}>
                                {document?.versions[0].file_name.length > 0 ? document?.versions[0].file_name : document?.uid}
                            </Typography.Text>
                        </Space>
                        <Typography.Text style={{ fontWeight: 400 }}>1 MB</Typography.Text>
                    </div>
                    <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', alignItems: "center", columnGap: selectedUser ? 8 : 0 }}>
                        <div style={{ width: selectedUser ? '60%' : '100%', transition: "width 0.3s" }}>
                            {/* <Cascader
                                placeholder="Select a member to add"
                                size="large"
                                style={{ width: "100%" }}
                                options={userList}
                                // value={searchNode}
                                // onChange={(id, node) => {
                                //     handleSearchNode(id)
                                // }}
                                // placeholder="Search node..."
                                showSearch={{
                                    filter: (inputValue, path) => {
                                        return path.some((option) => option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
                                    }
                                }}

                            /> */}
                            <Select
                                size="large"
                                style={{ width: "100%" }}
                                showSearch
                                allowClear
                                options={userList}
                                placeholder="Select a person"
                                value={selectedUser}
                                // optionFilterProp="children"
                                onChange={(value) => { setSelectedUser(value) }}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    (option?.value ?? '').toLowerCase().includes(input.toLowerCase())} />
                        </div>
                        <div style={{ width: selectedUser ? '25%' : 0, transition: "width 0.3s", overflow: "hidden" }}>
                            <Select
                                size="large"
                                style={{ width: "100%" }}
                                value={permissionType}
                                onChange={(value) => { setPermissionType(value) }}
                                options={[
                                    {
                                        value: 'VIEW',
                                        label: <Space>
                                            <EyeOutlined />
                                            <Typography.Text>VIEW</Typography.Text>
                                        </Space>,
                                    },
                                    {
                                        value: 'EDIT',
                                        label: <Space>
                                            <EditOutlined />
                                            <Typography.Text>EDIT</Typography.Text>
                                        </Space>,
                                    }
                                ]}
                            />
                        </div>
                        <div style={{ width: selectedUser ? '15%' : 0, transition: "width 0.3s", overflow: "hidden" }}>
                            <Button style={{ width: "100%" }} size="large" type="primary" onClick={() => { handleAddPermission() }}>
                                ADD
                            </Button>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <Typography.Text style={{ fontWeight: 450 }}>Shared with {document?.users_with_permission?.length - 1} members</Typography.Text>
                        <Segmented options={["ALL", "VIEW", "EDIT"]} onChange={(value) => { setPermissionCurrent(value) }} />
                    </div>
                    {/* <PermissionUserList /> */}
                    <div style={{ display: "flex" }}>
                        <div style={{ width: permissionCurrent == "ALL" ? "100%" : 0, transition: "width 0.3s", overflowX: "hidden" }}>
                            <PermissionUserList permissionList={document?.users_with_permission}
                                document={document} setDocument={setDocument} />
                        </div>
                        <div style={{ width: permissionCurrent == "VIEW" ? "100%" : 0, transition: "width 0.3s", overflowX: "hidden" }}>
                            <PermissionUserList permissionList={document?.users_with_permission?.filter((item, index) => item.permission == "VIEW")}
                                document={document} setDocument={setDocument} />
                        </div>
                        <div style={{ width: permissionCurrent == "EDIT" ? "100%" : 0, transition: "width 0.3s", overflowX: "hidden" }}>
                            <PermissionUserList permissionList={document?.users_with_permission?.filter((item, index) => item.permission == "EDIT")}
                                document={document} setDocument={setDocument} />
                        </div>
                    </div>

                </>} open={modalOpen} maskClosable={true}
                onCancel={() => { setModalOpen(false) }}>

            </Modal>
            <div onClick={() => { setModalOpen(true) }}>
                {modalButton}
            </div>
        </>
    )
}

export default PermissionModal