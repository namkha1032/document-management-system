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
    Cascader
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
    PlusOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateMetadata } from "../../apis/documentApi";
import randomString from "../../functions/randomString";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getUserList } from "../../apis/userApi";
const PermissionModal = (props) => {
    let document = props.document
    let modalButton = props.modalButton
    let [modalOpen, setModalOpen] = useState(false)
    let [userList, setUserList] = useState(null)
    useEffect(() => {
        async function fetchData() {
            let response = await getUserList()
            let newUserList = response.map((item, index) => {
                return {
                    "value": item.email,
                    "label": <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <Avatar src={`/file/avatar.png`} />
                        <Typography.Text>{item.email}</Typography.Text>
                    </div>
                }
            })
            setUserList(newUserList)
        }
        fetchData()
    }, [])
    console.log("document in modal", document)
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
                    <Cascader
                        size="large"
                        style={{ width: "100%", marginTop: 16 }}
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

                    />
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