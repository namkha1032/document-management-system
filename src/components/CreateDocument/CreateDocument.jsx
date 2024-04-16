import { useContext, useState, useEffect } from "react";
import ModeThemeContext from "../../context/ModeThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Table,
    Modal,
    Upload,
    Popconfirm,
    Tabs,
    Input,
    Card,
    Skeleton,
    Steps,
    theme,
    Row,
    Col,
} from "antd"
import {
    ShareAltOutlined,
    PlusOutlined,
    UploadOutlined,
    CheckOutlined,
    DeleteOutlined,
    LoadingOutlined,
    HourglassOutlined
} from '@ant-design/icons';
import UploadDocumentContext from "../../context/UploadDocumentContext";
import { apiExtractMetadata, apiSaveDocumentToCloud } from "../../apis/documentApi";
const CreateDocument = () => {
    const antdTheme = theme.useToken()
    const [uploadDocument, dispatchUploadDocument] = useContext(UploadDocumentContext)
    let userStorage = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()
    return (
        <>
            <Button onClick={() => {
                dispatchUploadDocument({
                    type: "addItem", payload: {
                        uploadType: "create"
                    }
                })
            }} type="primary"
                icon={<PlusOutlined />} size={"large"}>
                New document
            </Button>
        </>
    )
}

export default CreateDocument