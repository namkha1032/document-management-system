// import packages
import { useQueryClient, useMutation, useMutationState } from "@tanstack/react-query"
import { useEffect } from "react"
// import my components
import Bread from "../../components/Bread/Bread"
// import ui components
import {
    Typography,
    Row,
    Col,
    Tag,
    Card,
    Select
} from "antd"
// import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { LaptopOutlined } from "@ant-design/icons"
// import apis
import { getSearchResult } from "../../apis/searchApi"
// import hooks
// import functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

const Page_Search = (props) => {
    console.log('---------------render Page_Search----------------')
    // props
    // const searchOptionQuery = props.searchOptionQuery
    // const searchResultQuery = props.searchResultQuery
    const searchMutation = props.searchMutation

    const queryClient = useQueryClient()
    const searchOption = queryClient.getQueryData(['searchOption'])
    const searchResult = queryClient.getQueryData(['searchResult'])
    console.log('searchResult in page', searchResult)
    // useEffect(() => {
    //     return () => {
    //         queryClient.setQueryData(['searchOption'], {
    //             original_query: '',
    //             extend_keywords: [],
    //             metadata: [],
    //             method: null
    //         })
    //         queryClient.setQueryData(['searchResult'], {
    //             documents: [],
    //             broader: [],
    //             related: [],
    //             narrower: []
    //         })
    //     }
    // }, [])
    // const searchMutationArray = useMutationState({
    //     // this mutation key needs to match the mutation key of the given mutation (see above)
    //     filters: { mutationKey: ['searchMutation'] }
    // })
    // const searchMutation = searchMutationArray[0]
    // console.log("searchMutation: ", searchMutation)
    async function handleAddKeyword(keywordItem, type) {
        await queryClient.setQueryData(['searchResult'], oldSearchResult => {
            const newBroader = type == 'broader'
                ?
                oldSearchResult.broader.filter(broaderItem => {
                    if (broaderItem.keyword != keywordItem.keyword) {
                        return true
                    }
                })
                : oldSearchResult.broader
            const newRelated = type == 'related'
                ?
                oldSearchResult.related.filter(relatedItem => {
                    if (relatedItem.keyword != keywordItem.keyword) {
                        return true
                    }
                })
                : oldSearchResult.related
            const newNarrower = type == 'narrower'
                ?
                oldSearchResult.narrower.filter(narrowerItem => {
                    if (narrowerItem.keyword != keywordItem.keyword) {
                        return true
                    }
                })
                : oldSearchResult.narrower
            return {
                ...oldSearchResult,
                broader: newBroader,
                related: newRelated,
                narrower: newNarrower
            }
        })
        await queryClient.setQueryData(['searchOption'], oldSearchOption => {
            const newExtendKeywords = oldSearchOption.extend_keywords.concat({
                ...keywordItem,
                type: type,
                color: type == 'broader' ? 'red' : (type == 'related' ? 'green' : 'blue')
            })
            return {
                ...oldSearchOption,
                extend_keywords: newExtendKeywords
            }
        })
    }
    async function handleChangeDomain(value) {
        queryClient.setQueryData(['searchOption'], oldSearchOption => {
            return {
                ...oldSearchOption,
                domain: value
            }
        })
    }
    async function handleChangeMethod(value) {
        queryClient.setQueryData(['searchOption'], oldSearchOption => {
            return {
                ...oldSearchOption,
                method: value
            }
        })
    }
    // HTMl
    return (
        <>
            <Bread title={"Search"} />
            <>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card title={'Keyword suggestion'} style={{ height: '100%' }}
                            extra={<Select
                                value={searchOption?.domain}
                                style={{
                                    width: 200,
                                }}
                                size={'large'}
                                onChange={handleChangeDomain}
                                options={[
                                    {
                                        value: 'phapluat',
                                        label:
                                            <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                                <FontAwesomeIcon icon={icon({ name: 'scale-balanced', style: 'solid' })} />
                                                <Typography.Text>Pháp luật</Typography.Text>
                                            </div>
                                    },
                                    {
                                        value: 'khmt',
                                        label:
                                            <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                                <FontAwesomeIcon icon={icon({ name: 'laptop-code', style: 'solid' })} />
                                                <Typography.Text>Khoa học máy tính</Typography.Text>
                                            </div>,
                                    }
                                ]}
                            />}>
                            <Row gutter={[10, 10]}>
                                <Col span={4}>
                                    <Typography.Text>Broader terms: </Typography.Text>
                                </Col>
                                <Col span={20} style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                    {searchResult?.broader.map((broaderItem, index) =>
                                        <Tag key={index} color='red' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(broaderItem, 'broader')}>
                                            {broaderItem.keyword}
                                        </Tag>
                                    )}
                                </Col>
                                <Col span={4}>
                                    <Typography.Text>Related terms: </Typography.Text>
                                </Col>
                                <Col span={20} style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                    {searchResult?.related.map((relatedItem, index) =>
                                        <Tag key={index} color='green' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(relatedItem, 'related')}>
                                            {relatedItem.keyword}
                                        </Tag>
                                    )}
                                </Col>
                                <Col span={4}>
                                    <Typography.Text>Narrower terms: </Typography.Text>
                                </Col>
                                <Col span={20} style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                    {searchResult?.narrower.map((narrowerItem, index) =>
                                        <Tag key={index} color='blue' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(narrowerItem, 'narrower')}>
                                            {narrowerItem.keyword}
                                        </Tag>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={'Metadata'} style={{ height: '100%' }}
                            extra={<Select
                                value={searchOption?.method}
                                style={{
                                    width: 200,
                                }}
                                size={'large'}
                                onChange={handleChangeMethod}
                                options={[
                                    {
                                        value: 'full-text',
                                        label:
                                            <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                                <FontAwesomeIcon icon={icon({ name: 'file-lines', style: 'solid' })} />
                                                <Typography.Text>Full-text search</Typography.Text>
                                            </div>
                                    },
                                    {
                                        value: 'semantic',
                                        label:
                                            <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                                <FontAwesomeIcon icon={icon({ name: 'brain', style: 'solid' })} />
                                                <Typography.Text>Semantic search</Typography.Text>
                                            </div>,
                                    },
                                    {
                                        value: 'filename',
                                        label:
                                            <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                                <FontAwesomeIcon icon={icon({ name: 'file-pdf', style: 'solid' })} />
                                                <Typography.Text>Search by file name</Typography.Text>
                                            </div>,
                                    }
                                ]}
                            />}
                        >
                            <Typography.Text>hehehe</Typography.Text>
                        </Card>
                    </Col>
                </Row>
            </>
            {searchMutation.isPending
                ? <Typography.Text>loading...</Typography.Text>
                : searchResult?.documents.map((doc, index) => (
                    <div key={index}>
                        <Typography.Text>{doc.title}</Typography.Text>
                        <br />
                    </div>
                ))
            }
        </>
    )
}

export default Page_Search