// import packages
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import useSearchMutation from '../../hooks/searchMutation';
// import functions
//////////////////////////////////////////////////////////////////////////////////////////////////////
const AdvancedSearchButton = (props) => {
    return (
        <>
            <Button shape='circle' type={"text"} size='small'>
                <SlidersOutlined style={{ fontSize: 16 }} />
            </Button>
        </>
    )
}

const NavBar = () => {
    // props
    // states
    // hooks
    const antdTheme = theme.useToken()
    let queryClient = useQueryClient()
    const searchMutation = useSearchMutation()
    const navigate = useNavigate()
    // queries
    let searchOption = useQuery({
        queryKey: ['searchOption'],
        queryFn: () => {
            // return {
            //     extend_keywords: [],
            //     metadata: [],
            //     method: null
            // }
            return null
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    })
    let searchResult = useQuery({
        queryKey: ['searchResult'],
        queryFn: () => {
            // return {
            //     documents: [],
            //     broader: [],
            //     related: [],
            //     narrower: []
            // }
            return null
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    })
    // mutations
    // functions
    async function handleSearch(value) {
        let searchOp = await queryClient.getQueryData(['searchOption'])
        let searchData = {
            original_query: value,
            ...searchOp
        }
        await queryClient.setQueryData(['searchOption'], searchData)
        navigate('/search')
    }
    // logics
    let modeTheme = queryClient.getQueryData(['modeTheme'])
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
                    {/* <Input
                        // style={{ transition: "backgroundColor 0.215s" }}
                        prefix={<SearchOutlined />}
                        suffix={<AdvancedSearchButton />}
                    /> */}
                    <Input.Search
                        placeholder="input search text"
                        enterButton="Search"
                        size="large"
                        suffix={<AdvancedSearchButton />}
                        onSearch={handleSearch}
                        prefix={<>
                            <Tag color='cyan' closeIcon>
                                Prevent Default
                            </Tag>
                        </>
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