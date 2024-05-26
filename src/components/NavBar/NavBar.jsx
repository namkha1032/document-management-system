// import packages
import { useNavigate, useLocation, Link, redirect } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
// import my components
// import ui components
import {
    Layout,
    theme,
    Typography,
    Switch,
    Input,
    Button,
    Row,
    Col,
    Avatar,
    Tag,
    Popover,
    Dropdown,
    Modal
} from 'antd';
// import icons
import {
    SlidersOutlined,
    SearchOutlined,
    CloseOutlined,
    UserOutlined,
    LogoutOutlined,
    HourglassOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
// import apis
import { getSearchResult } from '../../apis/searchApi';
import { apiUpdateInfo } from '../../apis/userApi';
// import hooks
// import functions
// import context
import ModeThemeContext from '../../context/ModeThemeContext';
import SearchOptionContext from '../../context/SearchOptionContext';
import SearchResultContext from '../../context/SearchResultContext';
import UserContext from '../../context/UserContext';
import TagButton from '../TagButton/TagButton';
import UploadDocumentContext from '../../context/UploadDocumentContext';
import ExtractModal from '../ExtractModal/ExtractModal';
import DocumentMyContext from '../../context/DocumentMyContext';
import DocumentSharedContext from '../../context/DocumentSharedContext';
import DocumentCompanyContext from '../../context/DocumentCompanyContext';
import DocumentTrashContext from '../../context/DocumentTrashContext';
//////////////////////////////////////////////////////////////////////////////////////////////////////
const AdvancedSearchButton = (props) => {
    const navigate = useNavigate()
    return (
        <>
            <Popover placement="bottom" content={'Advanced search'}>
                <Button shape='circle' type={"text"} size='small' onClick={() => { navigate('/search') }}>
                    <SlidersOutlined style={{ fontSize: 16 }} />
                </Button>
            </Popover>
        </>
    )
}

const NavBar = () => {
    let [user, dispatchUser] = useContext(UserContext)
    const antdTheme = theme.useToken()
    const navigate = useNavigate()
    let [searchOption, dispatchSearchOption] = useContext(SearchOptionContext)
    let [searchResult, dispatchSearchResult] = useContext(SearchResultContext)
    let [documentMy, dispatchDocumentMy] = useContext(DocumentMyContext)
    let [documentShared, dispatchDocumentShared] = useContext(DocumentSharedContext)
    let [documentCompany, dispatchDocumentCompany] = useContext(DocumentCompanyContext)
    let [documentTrash, dispatchDocumentTrash] = useContext(DocumentTrashContext)
    let [modalInfo, setModalInfo] = useState(false)
    let [loadingInfo, setLoadingInfo] = useState(false)
    const [uploadDocument, dispatchUploadDocument] = useContext(UploadDocumentContext)
    let [firstName, setFirstName] = useState(user?.first_name)
    let [lastName, setLastName] = useState(user?.last_name)
    console.log("firstName", firstName)
    console.log("lastName", lastName)
    // useEffect(() => {
    //     setFirstName(user?.first_name)
    //     setLastName(user?.last_name)
    // }, [user])
    // const location = useLocation()
    const dropdownItems = [
        {
            label: 'My profile',
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: 'Log out',
            key: '2',
            icon: <LogoutOutlined />,
        },
    ]
    async function handleSearch(value) {
        // if (!location.pathname.includes('search')) {
        navigate('/search')
        // }
        let newSearchOption = {
            ...searchOption,
            original_query: value,
            current: 1,
            pageSize: searchOption.pageSize
        }
        await dispatchSearchResult({ type: 'loading', payload: true })
        let newSearchResult = await getSearchResult(newSearchOption)
        await dispatchSearchResult({ type: 'search', payload: { newSearchResult, newSearchOption } })
        await dispatchSearchOption({ type: 'update', payload: newSearchOption })
        await dispatchSearchResult({ type: 'loading', payload: false })
    }
    async function handleRemoveKeyword(e, extendTerm, oriTerm, type) {
        e.preventDefault()
        let oldSearchResult = JSON.parse(JSON.stringify(searchResult))
        const newBroaderResult = type == 'broader'
            ? (oldSearchResult.broader.hasOwnProperty(oriTerm)
                ? {
                    ...oldSearchResult.broader,
                    [oriTerm]: [...oldSearchResult.broader[oriTerm], extendTerm]
                }
                : oldSearchResult.broader
            )
            : oldSearchResult.broader
        const newRelatedResult = type == 'related'
            ? (oldSearchResult.related.hasOwnProperty(oriTerm)
                ? {
                    ...oldSearchResult.related,
                    [oriTerm]: [...oldSearchResult.related[oriTerm], extendTerm]
                }
                : oldSearchResult.related
            )
            : oldSearchResult.related
        const newNarrowerResult = type == 'narrower'
            ? (oldSearchResult.narrower.hasOwnProperty(oriTerm)
                ? {
                    ...oldSearchResult.narrower,
                    [oriTerm]: [...oldSearchResult.narrower[oriTerm], extendTerm]
                }
                : oldSearchResult.narrower
            )
            : oldSearchResult.narrower
        let newSearchResult = {
            ...oldSearchResult,
            broader: newBroaderResult,
            related: newRelatedResult,
            narrower: newNarrowerResult
        }
        let oldSearchOption = JSON.parse(JSON.stringify(searchOption))
        let newSearchOption = null
        if (type == 'broader') {
            let newBroader = {}
            if (oldSearchOption.broader[oriTerm].length >= 2) {
                newBroader = {
                    ...oldSearchOption.broader,
                    [oriTerm]: oldSearchOption.broader[oriTerm].filter((item, index) => item != extendTerm)
                }
            }
            else {
                Object.entries(oldSearchOption.broader).forEach(([keyTerm, extendArray], index) => {
                    if (keyTerm != oriTerm) {
                        newBroader[keyTerm] = extendArray
                    }
                })
            }
            newSearchOption = {
                ...oldSearchOption,
                broader: newBroader
            }
        }
        else if (type == 'related') {
            let newRelated = {}
            if (oldSearchOption.related[oriTerm].length >= 2) {
                newRelated = {
                    ...oldSearchOption.related,
                    [oriTerm]: oldSearchOption.related[oriTerm].filter((item, index) => item != extendTerm)
                }
            }
            else {
                Object.entries(oldSearchOption.related).forEach(([keyTerm, extendArray], index) => {
                    if (keyTerm != oriTerm) {
                        newRelated[keyTerm] = extendArray
                    }
                })
            }
            newSearchOption = {
                ...oldSearchOption,
                related: newRelated
            }
        }
        else if (type == 'narrower') {
            let newNarrower = {}
            if (oldSearchOption.narrower[oriTerm].length >= 2) {
                newNarrower = {
                    ...oldSearchOption.narrower,
                    [oriTerm]: oldSearchOption.narrower[oriTerm].filter((item, index) => item != extendTerm)
                }
            }
            else {
                Object.entries(oldSearchOption.narrower).forEach(([keyTerm, extendArray], index) => {
                    if (keyTerm != oriTerm) {
                        newNarrower[keyTerm] = extendArray
                    }
                })
            }
            newSearchOption = {
                ...oldSearchOption,
                narrower: newNarrower
            }
        }
        dispatchSearchResult({ type: "update", payload: newSearchResult })
        dispatchSearchOption({ type: "update", payload: newSearchOption })
    }
    async function handleUpdateInfo() {
        setLoadingInfo(true)
        let newUser = {
            first_name: firstName,
            last_name: lastName
        }
        await apiUpdateInfo(newUser)
        dispatchUser({ type: "updateInfo", payload: newUser })
        setLoadingInfo(false)
        setModalInfo(false)
    }
    // logics
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let primaryBgColor = antdTheme.token.colorBgElevated
    let secondaryBgColor = antdTheme.token.colorBgLayout
    // let primaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgElevated : antdTheme.token.colorBgLayout
    // let secondaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgLayout : antdTheme.token.colorBgElevated
    // HTMl
    return (
        searchOption
            ?
            <Layout.Header
                style={{
                    paddingRight: `${antdTheme.token.paddingContentHorizontal}px`,
                    paddingLeft: 0,
                    background: secondaryBgColor
                }
                }
            >
                {/* <Row justify={"space-between"} align={"center"} style={{ height: "100%" }}> */}
                <Modal title={"User info"} open={modalInfo} maskClosable={true}
                    onCancel={() => { setModalInfo(false) }}
                    onOk={() => { handleUpdateInfo() }}
                    cancelText="Reset"
                    okText="Update"
                    centered
                    confirmLoading={loadingInfo}
                    width={"20%"}
                    okButtonProps={{
                        disabled: firstName === user.first_name && lastName === user.last_name
                    }}
                    // onCancel={() => {

                    // }}
                    footer={(_, { OkBtn, CancelBtn }) => (
                        <>
                            <Button onClick={() => {
                                setFirstName(user?.first_name)
                                setLastName(user?.last_name)
                            }}>Reset</Button>
                            {/* <CancelBtn /> */}
                            <OkBtn />
                        </>
                    )}
                >
                    <Row gutter={[8, 8]}>
                        <Col md={7} style={{ display: 'flex', alignItems: "center" }}>
                            <Typography.Text>First name</Typography.Text>
                        </Col>
                        <Col md={3} style={{ display: 'flex', alignItems: "center" }}>
                            <Typography.Text>:</Typography.Text>
                        </Col>
                        <Col md={14} style={{ display: 'flex', alignItems: "center" }}>
                            <Input value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
                        </Col>
                        <Col md={7} style={{ display: 'flex', alignItems: "center" }}>
                            <Typography.Text>Last name</Typography.Text>
                        </Col>
                        <Col md={3} style={{ display: 'flex', alignItems: "center" }}>
                            <Typography.Text>:</Typography.Text>
                        </Col>
                        <Col md={14} style={{ display: 'flex', alignItems: "center" }}>
                            <Input value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
                        </Col>
                    </Row>
                </Modal>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", height: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", width: "40%" }}>
                        {user?.is_expertuser
                            ? null
                            :
                            <Input.Search
                                placeholder="input search text"
                                // enterButton={<div>
                                //     <Typography.Text>Search</Typography.Text>
                                // </div>}
                                // enterButton='Search'
                                enterButton
                                size="large"
                                // suffix={<AdvancedSearchButton />}
                                onSearch={handleSearch}
                                prefix={
                                    <>
                                        {
                                            Object.entries(searchOption?.broader).map(([oriTerm, extendArray], index) =>
                                                extendArray.map((extendTerm, index) =>
                                                    <Tag key={index} color='green' closeIcon style={{ cursor: "pointer" }} onClick={(e) => handleRemoveKeyword(e, extendTerm, oriTerm, 'broader')} onClose={(e) => handleRemoveKeyword(e, extendTerm, oriTerm, 'broader')}>
                                                        {extendTerm}
                                                    </Tag>
                                                ))
                                        }
                                        {
                                            Object.entries(searchOption?.related).map(([oriTerm, extendArray], index) =>
                                                extendArray.map((extendTerm, index) =>
                                                    <Tag key={index} color='green' closeIcon onClose={(e) => handleRemoveKeyword(e, extendTerm, oriTerm, 'related')}>
                                                        {extendTerm}
                                                    </Tag>
                                                ))
                                        }
                                        {
                                            Object.entries(searchOption?.narrower).map(([oriTerm, extendArray], index) =>
                                                extendArray.map((extendTerm, index) =>
                                                    <Tag key={index} color='blue' closeIcon style={{ cursor: "pointer" }} onClick={(e) => handleRemoveKeyword(e, extendTerm, oriTerm, 'narrower')} onClose={(e) => handleRemoveKeyword(e, extendTerm, oriTerm, 'narrower')}>
                                                        {extendTerm}
                                                    </Tag>
                                                ))
                                        }
                                    </>
                                }
                            >
                            </Input.Search>
                        }
                    </div>
                    <div style={{ width: '60%', display: "flex", justifyContent: "flex-start", flexDirection: 'row-reverse', alignItems: "center", columnGap: 8 }}>
                        <Dropdown menu={{
                            items: dropdownItems,
                            onClick: (e) => {
                                if (e.key == "2") {
                                    // delete localStorage here
                                    dispatchUser({ type: "logout" })
                                    dispatchDocumentCompany({ type: "reset" })
                                    dispatchDocumentMy({ type: "reset" })
                                    dispatchDocumentShared({ type: "reset" })
                                    dispatchDocumentTrash({ type: "reset" })
                                    dispatchUploadDocument({ type: "reset" })
                                    dispatchSearchOption({ type: "reset" })
                                    dispatchSearchResult({ type: "reset" })
                                    navigate("/login")
                                }
                                if (e.key == "1") {
                                    setModalInfo(true)
                                }
                            },
                        }} placement='bottomLeft' arrow={true} trigger={["click"]}>
                            <Avatar style={{ cursor: "pointer" }} size={"large"} src="/file/avatar.png" />
                        </Dropdown>
                        <Typography.Text>{user?.first_name + " " + user?.last_name}</Typography.Text>
                        <Switch checked={modeTheme == "dark"}
                            checkedChildren={<FontAwesomeIcon icon={icon({ name: 'moon', style: 'solid' })} />}
                            unCheckedChildren={<FontAwesomeIcon icon={icon({ name: 'sun', style: 'solid' })} />}
                            onClick={(e) => {
                                if (e) {
                                    dispatchModeTheme({ type: "dark" })
                                }
                                else {
                                    dispatchModeTheme({ type: "light" })
                                }
                            }} />
                        <div style={{ display: "flex", justifyContent: "flex-end", flexDirection: "row", alignItems: "center" }}>
                            {uploadDocument.length > 0
                                ? uploadDocument.map((item, index) =>
                                    <div key={index}>
                                        <ExtractModal index={index} />
                                    </div>
                                )
                                : null}
                        </div>

                    </div>
                </div>
                {/* </Row> */}
            </Layout.Header >
            : null

    )
}

export default NavBar