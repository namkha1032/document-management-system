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
    Tag
} from "antd"
// import icons
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
    // const searchPending = queryClient.getQueryData(['searchPending'])
    // useEffect(() => {
    //     console.log("in useEffect")
    //     console.log('ori query', searchOption?.original_query)
    //     if (searchOption && searchOption?.original_query != '') {
    //         console.log('nice')
    //         searchMutation.mutate(searchOption)
    //     }
    // }, [searchOption])

    // const searchMutation = useMutation({
    //     // mutationKey: ['searchMutation'],
    //     mutationFn: getSearchResult,
    //     onSuccess: (response) => {
    //         queryClient.setQueryData(['searchResult'], response)
    //     }
    // })
    useEffect(() => {
        if (searchOption && searchOption?.original_query != '') {
            searchMutation.mutate(searchOption)
        }
        return () => {
            queryClient.setQueryData(['searchOption'], {
                extend_keywords: [],
                metadata: [],
                method: null
            })
            queryClient.setQueryData(['searchResult'], {
                documents: [],
                broader: [],
                related: [],
                narrower: []
            })
        }
    }, [])
    // const searchMutationArray = useMutationState({
    //     // this mutation key needs to match the mutation key of the given mutation (see above)
    //     filters: { mutationKey: ['searchMutation'] }
    // })
    // const searchMutation = searchMutationArray[0]
    // console.log("searchMutation: ", searchMutation)
    async function handleAddKeyword(keywordItem) {
        queryClient.setQueryData(['searchResult'], oldSearchResult => {
            const newBroader = oldSearchResult.broader.filter(broaderItem => {
                if (broaderItem.keyword != keywordItem.keyword) {
                    return true
                }
            })
            const newRelated = oldSearchResult.related.filter(relatedItem => {
                if (relatedItem.keyword != keywordItem.keyword) {
                    return true
                }
            })
            const newNarrower = oldSearchResult.narrower.filter(narrowerItem => {
                if (narrowerItem.keyword != keywordItem.keyword) {
                    return true
                }
            })
            return {
                ...oldSearchResult,
                broader: newBroader,
                related: newRelated,
                narrower: newNarrower
            }
        })
        queryClient.setQueryData(['searchOption'], oldSearchOption => {
            const newExtendKeywords = oldSearchOption.extend_keywords.concat(keywordItem)
            return {
                ...oldSearchOption,
                extend_keywords: newExtendKeywords
            }
        })
    }
    // HTMl
    return (
        <>
            <Bread title={"Search"} />
            {searchMutation.isPending
                ?
                <Typography.Text>loading...</Typography.Text>
                :
                (searchResult?.documents.length > 0
                    ?
                    <>
                        <Typography.Text>Search query: {searchOption.original_query}</Typography.Text>
                        <Row style={{ width: '50%' }} gutter={[10, 10]}>
                            <Col span={4}>
                                <Typography.Text>Broader: </Typography.Text>
                            </Col>
                            <Col span={20}>
                                {searchResult.broader.map((broaderItem, index) =>
                                    <Tag key={index} color='cyan' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(broaderItem)}>
                                        {broaderItem.keyword}
                                    </Tag>
                                )}
                            </Col>
                            <Col span={4}>
                                <Typography.Text>Related: </Typography.Text>
                            </Col>
                            <Col span={20}>
                                {searchResult.related.map((relatedItem, index) =>
                                    <Tag key={index} color='cyan'>
                                        {relatedItem.keyword}
                                    </Tag>
                                )}
                            </Col>
                            <Col span={4}>
                                <Typography.Text>Narrower: </Typography.Text>
                            </Col>
                            <Col span={20}>
                                {searchResult.narrower.map((narrowerItem, index) =>
                                    <Tag key={index} color='cyan'>
                                        {narrowerItem.keyword}
                                    </Tag>
                                )}
                            </Col>
                        </Row>
                    </>
                    :
                    null
                )


            }
        </>
    )
}

export default Page_Search