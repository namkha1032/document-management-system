// import packages
import { useQueryClient, useMutation, useMutationState } from "@tanstack/react-query"
import { useEffect, useState } from "react"
// import my components
import Bread from "../../components/Bread/Bread"
// import ui components
import {
    Typography,
    Row,
    Col,
    Tag,
    Card,
    Select,
    AutoComplete,
    Input,
    Button,
    theme
} from "antd"
// import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { LaptopOutlined, PlusOutlined } from "@ant-design/icons"
// import apis
import { getSearchResult } from "../../apis/searchApi"
// import hooks
// import functions
//////////////////////////////////////////////////////////////////////////////////////////////////////
function randomString() {
    const result = Math.random().toString(36).substring(2, 7);
    return result
}
const metadata = {
    "metadata": [
        {
            "$and": [
                {
                    "$or": [
                        {
                            "$and": [
                                {
                                    "key": "A"
                                },
                                {
                                    "$not": {
                                        "key": "B"
                                    }
                                },
                                {
                                    "key": "C"
                                }
                            ]
                        },
                        {
                            "$not": {
                                "key": "D"
                            }
                        },
                        {
                            "$and": [
                                {
                                    "key": "F"
                                },
                                {
                                    "key": "G"
                                }
                            ]
                        }
                    ]
                },
                {
                    "$not": {
                        "key": "E"
                    }
                }
            ]
        }
    ]
}
function calculateTreeHeight(subTree) {
    if (subTree.hasOwnProperty('key') || subTree.hasOwnProperty('$not')) {
        console.log('subTree in 1', subTree)
        return 1
    }
    if (subTree.hasOwnProperty('$and')) {
        console.log('subTree in 2', subTree)
        return 1 + Math.max(...subTree.$and.map((item, index) => calculateTreeHeight(item)))
    }
    else if (subTree.hasOwnProperty('$or')) {
        console.log('subTree in 3', subTree)
        return 1 + Math.max(...subTree.$or.map((item, index) => calculateTreeHeight(item)))
    }
}
function recurAddMetadata(obj_id, myObj, type) {
    if (myObj.obj_id == obj_id) {
        if (myObj.hasOwnProperty('$and')) {
            // let newObj = type == 'metadata'
            //     ? {
            //         obj_id: randomString(),
            //         key: '',
            //         value: ''
            //     }
            //     : {
            //         obj_id: randomString(),
            //         $and: []
            //     }
            // let newAndArray = [
            //     newObj,
            //     ...myObj.$and
            // ]
            // return {
            //     ...myObj,
            //     $and: newAndArray
            // }
            let newReturn = type == 'outer'
                ? {
                    obj_id: randomString(),
                    $and: [myObj]
                } : (
                    type == 'inner'
                        ? {
                            ...myObj,
                            $and: [
                                {
                                    obj_id: randomString(),
                                    $and: []
                                },
                                ...myObj.$and
                            ]
                        }
                        : {
                            ...myObj,
                            $and: [
                                {
                                    obj_id: randomString(),
                                    key: '',
                                    value: ''
                                },
                                ...myObj.$and
                            ]
                        }
                )
            return newReturn
        }
        else if (myObj.hasOwnProperty('$or')) {
            // let newObj = type == 'metadata'
            //     ? {
            //         obj_id: randomString(),
            //         key: '',
            //         value: ''
            //     }
            //     : {
            //         obj_id: randomString(),
            //         $and: []
            //     }
            // let newOrArray = [
            //     newObj,
            //     ...myObj.$or
            // ]
            // return {
            //     ...myObj,
            //     $or: newOrArray
            // }
            let newReturn = type == 'outer'
                ? {
                    obj_id: randomString(),
                    $and: [myObj]
                } : (
                    type == 'inner'
                        ? {
                            ...myObj,
                            $or: [
                                {
                                    obj_id: randomString(),
                                    $and: []
                                },
                                ...myObj.$or
                            ]
                        }
                        : {
                            ...myObj,
                            $or: [
                                {
                                    obj_id: randomString(),
                                    key: '',
                                    value: ''
                                },
                                ...myObj.$or
                            ]
                        }
                )
            return newReturn
        }
    }
    else {
        if (myObj.hasOwnProperty('$and')) {
            return {
                ...myObj,
                $and: myObj.$and.map((item, index) => recurAddMetadata(obj_id, item, type))
            }
        }
        else if (myObj.hasOwnProperty('$or')) {
            return {
                ...myObj,
                $or: myObj.$or.map((item, index) => recurAddMetadata(obj_id, item, type))
            }
        }
        else {
            return myObj
        }
    }
}
async function handleAddMetadata(obj_id, type, queryClient) {
    if (obj_id == null) {
        queryClient.setQueryData(['searchOption'], (oldSearchOption) => {
            let newMetadata1 = [
                {
                    obj_id: randomString(),
                    key: '',
                    value: '',
                },
                ...oldSearchOption.metadata
            ]
            const newMetadata2 = [
                {
                    obj_id: randomString(),
                    $and: [
                        {
                            obj_id: randomString(),
                            key: '',
                            value: '',
                        },
                        ...oldSearchOption.metadata,
                    ]
                }
            ]
            return {
                ...oldSearchOption,
                metadata: type == 1 ? newMetadata1 : newMetadata2
            }
        })
    }
    else {
        queryClient.setQueryData(['searchOption'], (oldSearchOption) => {
            return {
                ...oldSearchOption,
                metadata: oldSearchOption.metadata.map((item, index) => recurAddMetadata(obj_id, item, type))
            }
        })
    }
}
function recurTypeKeyValue(obj_id, myObj, keyvalue, type) {
    if (myObj.obj_id == obj_id) {
        let newObject = null
        if (myObj.hasOwnProperty('$not')) {
            newObject = type == 'key'
                ? {
                    ...myObj,
                    $not: {
                        ...myObj.$not,
                        key: keyvalue
                    }
                }
                : {
                    ...myObj,
                    $not: {
                        ...myObj.$not,
                        value: keyvalue,
                    }
                }
        }
        else if (myObj.hasOwnProperty('key')) {
            newObject = type == 'key'
                ? {
                    ...myObj,
                    key: keyvalue,
                }
                : {
                    ...myObj,
                    value: keyvalue,
                }
        }
        return newObject
    }
    else {
        if (myObj.hasOwnProperty('$and')) {
            return {
                ...myObj,
                $and: myObj.$and.map((item, index) => recurTypeKeyValue(obj_id, item, keyvalue, type))
            }
        }
        else if (myObj.hasOwnProperty('$or')) {
            return {
                ...myObj,
                $or: myObj.$or.map((item, index) => recurTypeKeyValue(obj_id, item, keyvalue, type))
            }
        }
        else {
            return myObj
        }
    }
}
async function handleTypeKeyValue(obj_id, keyvalue, type, queryClient) {
    queryClient.setQueryData(['searchOption'], oldSearchOption => {
        return {
            ...oldSearchOption,
            metadata: oldSearchOption.metadata.map((item, index) => recurTypeKeyValue(obj_id, item, keyvalue, type))
        }
    })
}
const MetaForm = (props) => {
    const antdTheme = theme.useToken()
    const myObj = props.myObj
    const treeHeight = props.treeHeight
    const currHeight = props.currHeight
    let queryClient = useQueryClient()
    if (Array.isArray(myObj)) {
        return (
            <>
                {myObj.map((item, index) =>
                    <div key={index}>
                        <MetaForm myObj={item} treeHeight={treeHeight} currHeight={currHeight} />
                    </div>
                )}
            </>
        )
    }
    else {
        if (myObj.hasOwnProperty('$and') || myObj.hasOwnProperty('$or')) {
            return (
                <Card type="inner" size={'small'}
                    headStyle={{ backgroundColor: antdTheme.token.colorBgLayout }}
                    style={{ border: `1px solid ${antdTheme.token.colorTextQuaternary}` }}
                    title={
                        <div style={{ display: 'flex', columnGap: 8 }}>
                            <Select
                                style={{ width: 80 }}
                                size="small"
                                value={myObj.hasOwnProperty('$and') ? '$and' : '$or'}
                                options={[
                                    {
                                        value: '$and',
                                        label: 'AND'
                                    },
                                    {
                                        value: '$or',
                                        label: 'OR'
                                    }
                                ]}
                            />
                            <Button size="small" icon={<PlusOutlined />} onClick={() => { handleAddMetadata(myObj.obj_id, 'metadata', queryClient) }}>metadata</Button>
                            <Button size="small" icon={<PlusOutlined />} onClick={() => { handleAddMetadata(myObj.obj_id, 'inner', queryClient) }}>inner</Button>
                            <Button size="small" icon={<PlusOutlined />} onClick={() => { handleAddMetadata(myObj.obj_id, 'outer', queryClient) }}>outer</Button>
                        </div>
                    }>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                        {myObj.hasOwnProperty('$and')
                            ?
                            myObj.$and.map((item, index) =>
                                <div key={index}>
                                    <MetaForm myObj={item} treeHeight={treeHeight} currHeight={currHeight + 1} />
                                </div>
                            )
                            :
                            myObj.$or.map((item, index) =>
                                <div key={index}>
                                    <MetaForm myObj={item} treeHeight={treeHeight} currHeight={currHeight + 1} />
                                </div>)
                        }
                    </div>
                </Card>
            )
        }
        else if (myObj.hasOwnProperty('$not') || myObj.hasOwnProperty('key')) {
            return (
                <div style={{
                    display: 'flex', columnGap: 8, justifyContent: 'flex-start',
                    // marginLeft: (treeHeight - currHeight) * 25
                }}>
                    <AutoComplete
                        style={{
                            width: 160,
                        }}
                        placeholder="key"
                        value={myObj.hasOwnProperty('$not') ? myObj.$not.key : myObj.key}
                        onChange={(val) => { handleTypeKeyValue(myObj.obj_id, val, 'key', queryClient) }}
                    />
                    <Select
                        style={{ width: 80 }}
                        value={myObj.hasOwnProperty('$not') ? 'isnot' : 'is'}
                        options={[
                            {
                                value: 'is',
                                label: 'IS'
                            },
                            {
                                value: 'isnot',
                                label: 'IS NOT'
                            }
                        ]}
                    />
                    <Input
                        value={myObj.hasOwnProperty('$not') ? myObj.$not.value : myObj.value}
                        onChange={(e) => { handleTypeKeyValue(myObj.obj_id, e.target.value, 'value', queryClient) }}
                        style={{ width: 160 }} placeholder='value' />
                </div>
            )
        }
    }

}

const Page_Search = (props) => {
    console.log('---------------render Page_Search----------------')
    // props
    // const searchOptionQuery = props.searchOptionQuery
    // const searchResultQuery = props.searchResultQuery
    const searchMutation = props.searchMutation
    const [inp, setInp] = useState('')
    const queryClient = useQueryClient()
    const searchOption = queryClient.getQueryData(['searchOption'])
    const searchResult = queryClient.getQueryData(['searchResult'])
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
    let treeHeight = 0
    if (searchOption && searchOption.metadata.length > 0) {
        treeHeight = calculateTreeHeight(searchOption.metadata[0])
    }
    console.log('treeHeight', treeHeight)
    const leftTerm = 6
    const rightTerm = 18
    // HTMl
    return (
        searchOption
            ?
            <>
                < Bread title={"Search"} />
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
                                    <Col span={leftTerm}>
                                        <Typography.Text>Broader terms: </Typography.Text>
                                    </Col>
                                    <Col span={rightTerm} style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                        {searchResult?.broader.map((broaderItem, index) =>
                                            <Tag key={index} color='red' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(broaderItem, 'broader')}>
                                                {broaderItem.keyword}
                                            </Tag>
                                        )}
                                    </Col>
                                    <Col span={leftTerm}>
                                        <Typography.Text>Related terms: </Typography.Text>
                                    </Col>
                                    <Col span={rightTerm} style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                        {searchResult?.related.map((relatedItem, index) =>
                                            <Tag key={index} color='green' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(relatedItem, 'related')}>
                                                {relatedItem.keyword}
                                            </Tag>
                                        )}
                                    </Col>
                                    <Col span={leftTerm}>
                                        <Typography.Text>Narrower terms: </Typography.Text>
                                    </Col>
                                    <Col span={rightTerm} style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
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
                                {searchOption.metadata.length == 0 || searchOption.metadata[0].hasOwnProperty('key') || searchOption.metadata[0].hasOwnProperty('$not')
                                    ? <>
                                        <div style={{ display: 'flex', columnGap: 8, marginBottom: 8 }}>
                                            <Button icon={<PlusOutlined />} onClick={() => { handleAddMetadata(null, searchOption.metadata.length == 0 ? '1' : '2', queryClient) }}>metadata</Button>
                                        </div>
                                    </>
                                    : null
                                }
                                <MetaForm myObj={searchOption?.metadata} treeHeight={treeHeight} currHeight={1} />
                            </Card>
                        </Col>
                    </Row>
                </>
                {
                    searchMutation.isPending
                        ? <Typography.Text>loading...</Typography.Text>
                        : searchResult?.documents.map((doc, index) => (
                            <div key={index}>
                                <Typography.Text>{doc.title}</Typography.Text>
                                <br />
                            </div>
                        ))
                }
                <Input value={inp} onChange={e => setInp(e.target.value)} />
            </>
            : null
    )
}

export default Page_Search