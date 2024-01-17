// import packages
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
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
    Popover
} from 'antd';
// import icons
import {
    SlidersOutlined,
    SearchOutlined,
    CloseOutlined
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

const NavBar = (props) => {
    // props
    // const searchOptionQuery = props.searchOptionQuery
    // const searchResultQuery = props.searchResultQuery
    const searchMutation = props.searchMutation
    const antdTheme = theme.useToken()
    let queryClient = useQueryClient()
    const navigate = useNavigate()
    let [searchOption, dispatchSearchOption] = useContext(SearchOptionContext)
    let [searchResult, dispatchSearchResult] = useContext(SearchResultContext)
    // const location = useLocation()

    async function handleSearch(value) {
        // if (!location.pathname.includes('search')) {
        navigate('/search')
        // }
        let newSearchOption = {
            ...searchOption,
            original_query: value,
            pagination: {
                current: 1,
                pageSize: searchOption.pagination.pageSize
            }
        }
        // await queryClient.setQueryData(['searchOption'], newSearchOption)
        // await searchMutation.mutateAsync(newSearchOption)
        await dispatchSearchResult({ type: 'loading', payload: true })
        let newSearchResult = await getSearchResult(newSearchOption)
        await dispatchSearchResult({ type: 'search', payload: { newSearchResult, newSearchOption } })
        await dispatchSearchOption({ type: 'update', payload: newSearchOption })
        await dispatchSearchResult({ type: 'loading', payload: false })
    }
    async function handleRemoveKeyword(e, extendTerm, oriTerm, type) {
        e.preventDefault()
        queryClient.setQueryData(['searchResult'], (oldSearchResult) => {
            const newBroader = type == 'broader'
                ? (oldSearchResult.broader.hasOwnProperty(oriTerm)
                    ? {
                        ...oldSearchResult.broader,
                        [oriTerm]: [...oldSearchResult.broader[oriTerm], extendTerm]
                    }
                    : oldSearchResult.broader
                )
                : oldSearchResult.broader
            const newRelated = type == 'related'
                ? (oldSearchResult.related.hasOwnProperty(oriTerm)
                    ? {
                        ...oldSearchResult.related,
                        [oriTerm]: [...oldSearchResult.related[oriTerm], extendTerm]
                    }
                    : oldSearchResult.related
                )
                : oldSearchResult.related
            const newNarrower = type == 'narrower'
                ? (oldSearchResult.narrower.hasOwnProperty(oriTerm)
                    ? {
                        ...oldSearchResult.narrower,
                        [oriTerm]: [...oldSearchResult.narrower[oriTerm], extendTerm]
                    }
                    : oldSearchResult.narrower
                )
                : oldSearchResult.narrower
            return {
                ...oldSearchResult,
                broader: newBroader,
                related: newRelated,
                narrower: newNarrower
            }
        })
        queryClient.setQueryData(['searchOption'], (oldSearchOption) => {
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
                return {
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
                return {
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
                return {
                    ...oldSearchOption,
                    narrower: newNarrower
                }
            }
        })
    }
    // logics
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    // let searchOption = queryClient.getQueryData(['searchOption'])
    // HTMl
    return (
        searchOption
            ?
            <Layout.Header
                style={{
                    paddingRight: `${antdTheme.token.paddingContentHorizontal}px`,
                    paddingLeft: 0,
                    background: antdTheme.token.colorBgContainer
                }
                }
            >
                <Row justify={"space-between"} align={"center"} style={{ height: "100%" }}>
                    <Col md={10} style={{ display: "flex", alignItems: "center" }}>
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
                    </Col>
                    <Col md={5} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", columnGap: 10 }}>
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
                        <Typography.Text>Peter Parker</Typography.Text>
                        <Avatar size={"large"} src="/file/avatar.png" />
                    </Col>
                </Row>
            </Layout.Header >
            : null

    )
}

export default NavBar