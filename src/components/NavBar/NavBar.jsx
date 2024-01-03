// import packages
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
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
    Tag
} from 'antd';
// import icons
import {
    SlidersOutlined,
    SearchOutlined
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
            <Button shape='circle' type={"text"} size='small' onClick={() => { navigate('/search') }}>
                <SlidersOutlined style={{ fontSize: 16 }} />
            </Button>
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
    let searchOptionQuery = useQuery({
        queryKey: ['searchOption'],
        queryFn: () => {
            return {
                original_query: '',
                extend_keywords: [],
                metadata: [],
                method: null
            }
            // return null
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    })
    let searchResultQuery = useQuery({
        queryKey: ['searchResult'],
        queryFn: () => {
            return {
                documents: [],
                broader: [],
                related: [],
                narrower: []
            }
            // return null
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    })
    async function handleSearch(value) {
        // if (!location.pathname.includes('search')) {
        navigate('/search')
        // }
        let oldSearchOption = queryClient.getQueryData(['searchOption'])
        let newSearchOption = {
            ...oldSearchOption,
            original_query: value
        }
        queryClient.setQueryData(['searchOption'], newSearchOption)
        await searchMutation.mutateAsync(newSearchOption)
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
                        enterButton="Search"
                        size="large"
                        suffix={<AdvancedSearchButton />}
                        onSearch={handleSearch}
                        prefix={
                            searchOption?.extend_keywords.map((kw, index) =>
                                <Tag key={index} color='cyan' closeIcon onClose={() => {

                                }}>
                                    {kw.keyword}
                                </Tag>
                            )
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