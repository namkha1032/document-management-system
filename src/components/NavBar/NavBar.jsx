// import packages
import { useNavigate, useLocation, Link, redirect } from 'react-router-dom';
import { useContext } from 'react';
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
    Dropdown
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
    const [uploadDocument, dispatchUploadDocument] = useContext(UploadDocumentContext)

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
    // logics
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    // let primaryBgColor = antdTheme.token.colorBgLayout
    // let secondaryBgColor = antdTheme.token.colorBgElevated
    let primaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgElevated : antdTheme.token.colorBgLayout
    let secondaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgLayout : antdTheme.token.colorBgElevated
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", height: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", width: "40%" }}>
                        <Input.Search
                            placeholder="input search text"
                            // enterButton={<Typography.Text>Search</Typography.Text>}
                            enterButton='Search'
                            size="large"
                            suffix={<AdvancedSearchButton />}
                            onSearch={handleSearch}
                            prefix={
                                <>
                                    {
                                        Object.entries(searchOption?.broader).map(([oriTerm, extendArray], index) =>
                                            extendArray.map((extendTerm, index) =>
                                                <Tag key={index} color='red' closeIcon onClose={(e) => handleRemoveKeyword(e, extendTerm, oriTerm, 'broader')}>
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
                                                <Tag key={index} color='blue' closeIcon onClose={(e) => handleRemoveKeyword(e, extendTerm, oriTerm, 'narrower')}>
                                                    {extendTerm}
                                                </Tag>
                                            ))
                                    }
                                </>
                            }
                        >
                        </Input.Search>
                    </div>
                    <div style={{ width: '60%', display: "flex", justifyContent: "flex-start", flexDirection: 'row-reverse', alignItems: "center", columnGap: 8 }}>
                        <Dropdown menu={{
                            items: dropdownItems,
                            onClick: (e) => {
                                if (e.key == "2") {
                                    // delete localStorage here
                                    dispatchUser({ type: "logout" })
                                    navigate("/login")
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