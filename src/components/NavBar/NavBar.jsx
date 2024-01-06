// import packages
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation, Link, redirect } from 'react-router-dom';
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
    console.log('---------------render NavBar----------------')
    // props
    // const searchOptionQuery = props.searchOptionQuery
    // const searchResultQuery = props.searchResultQuery
    const searchMutation = props.searchMutation
    const antdTheme = theme.useToken()
    let queryClient = useQueryClient()
    const navigate = useNavigate()
    // const location = useLocation()

    async function handleSearch(value) {
        // if (!location.pathname.includes('search')) {
        navigate('/search')
        // }
        let oldSearchOption = queryClient.getQueryData(['searchOption'])
        let newSearchOption = {
            ...oldSearchOption,
            original_query: value,
            pagination: {
                current: 1,
                pageSize: oldSearchOption.pagination.pageSize
            }
        }
        queryClient.setQueryData(['searchOption'], newSearchOption)
        await searchMutation.mutateAsync(newSearchOption)
    }
    async function handleRemoveKeyword(e, kw) {
        e.preventDefault()
        queryClient.setQueryData(['searchResult'], (oldSearchResult) => {
            const newBroader = kw.type == 'broader'
                ?
                oldSearchResult.broader.concat(kw)
                : oldSearchResult.broader
            const newRelated = kw.type == 'related'
                ?
                oldSearchResult.related.concat(kw)
                : oldSearchResult.related
            const newNarrower = kw.type == 'narrower'
                ?
                oldSearchResult.narrower.concat(kw)
                : oldSearchResult.narrower
            return {
                ...oldSearchResult,
                broader: newBroader,
                related: newRelated,
                narrower: newNarrower
            }
        })
        queryClient.setQueryData(['searchOption'], (oldSearchOption) => {
            return {
                ...oldSearchOption,
                extend_keywords: oldSearchOption.extend_keywords.filter(kwItem => kwItem.keyword != kw.keyword)
            }
        })
    }
    // logics
    let modeTheme = queryClient.getQueryData(['modeTheme'])
    let searchOption = queryClient.getQueryData(['searchOption'])
    // let searchOption = searchOptionQuery.data
    // HTMl
    return (
        <Layout.Header
            style={{
                paddingRight: `${antdTheme.token.paddingContentHorizontal}px`,
                paddingLeft: 0,
                background: antdTheme.token.colorBgContainer
            }}
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
                            searchOption?.extend_keywords.map((kw, index) =>
                                <Tag key={index} color={kw.color} closeIcon onClose={(e) => handleRemoveKeyword(e, kw)}>
                                    {kw.keyword}
                                </Tag>)
                        }
                    >
                    </Input.Search>
                </Col>
                <Col md={5} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", columnGap: 10 }}>
                    <Switch checked={queryClient.getQueryData(['modeTheme']) == "dark"}
                        checkedChildren={<FontAwesomeIcon icon={icon({ name: 'moon', style: 'solid' })} />}
                        unCheckedChildren={<FontAwesomeIcon icon={icon({ name: 'sun', style: 'solid' })} />}
                        onClick={(e) => {
                            if (e) {
                                window.localStorage.setItem("modeTheme", "dark")
                                queryClient.setQueryData(['modeTheme'], "dark")
                            }
                            else {
                                window.localStorage.setItem("modeTheme", "light")
                                queryClient.setQueryData(['modeTheme'], "light")
                            }
                        }} />
                    <Typography.Text>Peter Parker</Typography.Text>
                    <Avatar size={"large"} src="https://avatarfiles.alphacoders.com/149/149117.jpg" />
                </Col>
            </Row>
        </Layout.Header>
    )
}

export default NavBar