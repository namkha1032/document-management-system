import { useContext, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import {
    Typography,
    Row,
    Col,
    Card,
    theme,
    Table,
    Avatar,
    Button,
    Skeleton,
    Pagination,
    Image,
    Checkbox,
    Empty,
    Tooltip,
    Modal
} from "antd"
import {
    DownloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    PlusOutlined,
    CloseOutlined,
    LinkOutlined,
    EyeOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import { MdVpnKey, MdOutlineDeleteForever, MdOutlineSettingsBackupRestore } from "react-icons/md";
import PermissionModal from "../../PermissionModal/PermissionModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { apiGetDocument } from "../../../apis/documentApi";
import TagButton from "../../TagButton/TagButton";
const CardSelectedDoc = (props) => {
    let selectedDoc = props.selectedDoc
    let setSelectedDoc = props.setSelectedDoc
    let setSelectedKey = props.setSelectedKey
    let originTitle = props.originTitle
    let originPath = props.originPath
    let [selectedDocState, setSelectedDocState] = useState(null)
    let [loadingSelectedDoc, setLoadingSelectedDoc] = useState(false)
    let antdTheme = theme.useToken()
    let navigate = useNavigate()
    console.log("selectedDocState", selectedDocState)
    async function fetchData() {
        setLoadingSelectedDoc(true)
        let documentResponse = await apiGetDocument(selectedDoc[0].uid)
        let documentCopy = { ...documentResponse, versions: documentResponse.versions.map(item => ({ ...item, file_size: Number(item.file_size || 0) })) }
        setSelectedDocState(documentCopy)
        setLoadingSelectedDoc(false)
    }
    useEffect(() => {
        if (selectedDoc?.length === 1) {
            fetchData()
        }
    }, [selectedDoc])
    return (
        <>
            <Card
                loading={loadingSelectedDoc}
                title={<div>
                    <Typography.Text ellipsis style={{ width: 290 }}>
                        {selectedDocState?.versions[0].file_name.length > 0 ? selectedDocState?.versions[0].file_name : selectedDocState?.uid}
                        {/* {selectedDocState?.versions[0].file_name.length > 0 ? "hahaha" : selectedDocState?.uid} */}
                        {/* {selectedDocState?.uid} */}
                        {/* {selectedDocState?.versions[0].file_name} */}
                    </Typography.Text>
                </div>}
                className="selectCard"
                extra={
                    <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <Button type={"primary"} onClick={() => {
                            navigate(`/document/${selectedDocState?.uid}`, {
                                state: {
                                    breadState: [
                                        { "title": originTitle, "path": `/${originPath}` },
                                        { "title": `${selectedDocState?.versions[0].file_name ? selectedDocState?.versions[0].file_name.slice(0, -16) : selectedDocState?.uid}`, "path": `/document/${selectedDocState?.uid}` }
                                    ]

                                }
                            })
                        }} icon={<EyeOutlined />}>View</Button>
                        <Button type={"text"} icon={<CloseOutlined />} onClick={() => {
                            setSelectedDoc([])
                            setSelectedKey([])
                        }} />

                    </div>
                }
                style={{
                    display: "flex", flexDirection: "column", height: "100%",
                    width: selectedDoc?.length == 1 ? "30%" : 0, transition: "width 0.3s, border-width 0.3s",
                    borderWidth: selectedDoc?.length == 1 ? "1px" : "0px",
                    borderColor: antdTheme.token.colorBorder
                }}
                styles={{
                    header: {
                        flex: "0 1 auto",
                        // width: "100%",
                        // display: "flex",
                        // alignItems: "flex-end"
                    },
                    body: {
                        flex: "1 1 auto",
                        display: 'flex',
                        flexDirection: "column"
                    }
                }}
            >
                <div style={{ flex: 1, position: "relative" }}>
                    <div
                        id={"cardSelectedDoc"}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflowY: "scroll"
                        }}>
                        <div style={{ height: 300, overflow: "hidden", display: "flex", border: `1px solid ${antdTheme.token.colorBorder}`, borderRadius: 8 }}>
                            <Image src={selectedDocState?.versions[0]?.url.length > 0
                                ? `//image.thum.io/get/pdfSource/page/1/${selectedDocState?.versions[0]?.url}`
                                : "//image.thum.io/get/pdfSource/page/1/https://pdfobject.com/pdf/sample.pdf"} />
                        </div>
                        <Typography.Title ellipsis level={4}>Who has access</Typography.Title>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Avatar.Group size={48} maxCount={2}>
                                {selectedDocState?.users_with_permission.map((userPer, idx) =>
                                    <Tooltip key={idx} title={`${userPer.email}`}>
                                        <Avatar src={`/file/avatar.png`} />
                                    </Tooltip>
                                )
                                }
                            </Avatar.Group>
                            {/* <Button icon={<MdVpnKey />} style={{ display: "flex", alignItems: "center", height: 48, fontSize: 16, borderColor: antdTheme.token.colorText, color: antdTheme.token.colorText }}>Manage access</Button> */}
                            <PermissionModal document={selectedDocState} setDocument={setSelectedDocState}
                                modalButton={
                                    <TagButton icon={<MdVpnKey />} color="geekblue" columnGap={8} width={200}>
                                        Manage access
                                    </TagButton>
                                } />
                        </div>
                        <Typography.Title ellipsis level={4}>Owner</Typography.Title>
                        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", columnGap: 8 }}>
                            <Avatar size={48} src={`/file/avatar.png`} />
                            <Typography.Text style={{ fontSize: 24 }} ellipsis>{`${selectedDocState?.owner.first_name} ${selectedDocState?.owner.last_name}`}</Typography.Text>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default CardSelectedDoc