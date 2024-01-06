// import packages
import { useQueryClient, useMutation, useMutationState } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
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
import Container from '@mui/material/Container';
// import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { LaptopOutlined, PlusOutlined, CloseOutlined, CloseCircleOutlined, CloseCircleFilled, CloseCircleTwoTone } from "@ant-design/icons"
// import apis
import { getSearchResult } from "../../apis/searchApi"
import { hover } from "@testing-library/user-event/dist/hover"
// import hooks
// import functions
//////////////////////////////////////////////////////////////////////////////////////////////////////
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

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
        return 1
    }
    if (subTree.hasOwnProperty('$and')) {
        return 1 + Math.max(...subTree.$and.map((item, index) => calculateTreeHeight(item)))
    }
    else if (subTree.hasOwnProperty('$or')) {
        return 1 + Math.max(...subTree.$or.map((item, index) => calculateTreeHeight(item)))
    }
}
function recurAddMetadata(obj_id, type, myObj) {
    if (myObj.obj_id == obj_id) {
        if (myObj.hasOwnProperty('$and')) {
            let newReturn = type == 'outer'
                ? {
                    obj_id: randomString(),
                    $and: [myObj]
                } : (
                    type == 'inner'
                        ? {
                            ...myObj,
                            $and: [
                                ...myObj.$and,
                                {
                                    obj_id: randomString(),
                                    $and: []
                                }
                            ]
                        }
                        : {
                            ...myObj,
                            $and: [
                                ...myObj.$and,
                                {
                                    obj_id: randomString(),
                                    key: '',
                                    value: ''
                                }
                            ]
                        }
                )
            return newReturn
        }
        else if (myObj.hasOwnProperty('$or')) {
            let newReturn = type == 'outer'
                ? {
                    obj_id: randomString(),
                    $and: [myObj]
                } : (
                    type == 'inner'
                        ? {
                            ...myObj,
                            $or: [
                                ...myObj.$or,
                                {
                                    obj_id: randomString(),
                                    $and: []
                                }
                            ]
                        }
                        : {
                            ...myObj,
                            $or: [
                                ...myObj.$or,
                                {
                                    obj_id: randomString(),
                                    key: '',
                                    value: ''
                                }
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
                $and: myObj.$and.map((item, index) => recurAddMetadata(obj_id, type, item))
            }
        }
        else if (myObj.hasOwnProperty('$or')) {
            return {
                ...myObj,
                $or: myObj.$or.map((item, index) => recurAddMetadata(obj_id, type, item))
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
                ...oldSearchOption.metadata,
                {
                    obj_id: randomString(),
                    key: '',
                    value: '',
                }
            ]
            let newMetadata2 = [
                {
                    obj_id: randomString(),
                    $and: [
                        ...oldSearchOption.metadata,
                        {
                            obj_id: randomString(),
                            key: '',
                            value: '',
                        }
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
                metadata: oldSearchOption.metadata.map((item, index) => recurAddMetadata(obj_id, type, item))
            }
        })
    }
}
function recurTypeKeyValue(obj_id, keyvalue, type, myObj) {
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
                $and: myObj.$and.map((item, index) => recurTypeKeyValue(obj_id, keyvalue, type, item))
            }
        }
        else if (myObj.hasOwnProperty('$or')) {
            return {
                ...myObj,
                $or: myObj.$or.map((item, index) => recurTypeKeyValue(obj_id, keyvalue, type, item))
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
            metadata: oldSearchOption.metadata.map((item, index) => recurTypeKeyValue(obj_id, keyvalue, type, item))
        }
    })
}

function recurChangeIsNot(obj_id, val, myObj) {
    if (myObj.obj_id == obj_id) {
        let newReturn = val == 'is'
            ?
            {
                ...myObj.$not
            }
            :
            {
                obj_id: myObj.obj_id,
                $not: {
                    ...myObj
                }
            }
        return newReturn
    }
    else {
        if (myObj.hasOwnProperty('$and')) {
            return {
                ...myObj,
                $and: myObj.$and.map((item, index) => recurChangeIsNot(obj_id, val, item))
            }
        }
        else if (myObj.hasOwnProperty('$or')) {
            return {
                ...myObj,
                $or: myObj.$or.map((item, index) => recurChangeIsNot(obj_id, val, item))
            }
        }
        else {
            return myObj
        }
    }
}
async function handleChangeIsNot(obj_id, val, queryClient) {
    queryClient.setQueryData(['searchOption'], oldSearchOption => {
        return {
            ...oldSearchOption,
            metadata: oldSearchOption.metadata.map((item, index) => recurChangeIsNot(obj_id, val, item))
        }
    })
}

function recurDeleteMetadata(obj_id, myObj) {
    if (myObj.hasOwnProperty('$and')) {
        let newReturn = {
            ...myObj,
            $and: myObj.$and.filter((item, index) => item.obj_id != obj_id)
        }
        return newReturn.$and.length == myObj.$and.length
            ? {
                ...myObj,
                $and: myObj.$and.map((item, index) => recurDeleteMetadata(obj_id, item))
            }
            : newReturn
    }
    else if (myObj.hasOwnProperty('$or')) {
        let newReturn = {
            ...myObj,
            $or: myObj.$or.filter((item, index) => item.obj_id != obj_id)
        }
        return newReturn.$or.length == myObj.$or.length
            ? {
                ...myObj,
                $or: myObj.$or.map((item, index) => recurDeleteMetadata(obj_id, item))
            }
            : newReturn
    }
    else {
        return myObj
    }
}

async function handleDeleteMetadata(obj_id, queryClient) {
    queryClient.setQueryData(['searchOption'], oldSearchOption => {
        if (oldSearchOption.metadata[0].obj_id == obj_id) {
            return {
                ...oldSearchOption,
                metadata: []
            }
        }
        else {
            return {
                ...oldSearchOption,
                metadata: oldSearchOption.metadata.map((item, index) => recurDeleteMetadata(obj_id, item))
            }
        }
    })
}
function recurChangeAndOr(obj_id, val, myObj) {
    if (myObj.obj_id == obj_id) {
        let newReturn = val == '$and'
            ?
            {
                obj_id: myObj.obj_id,
                $and: [...myObj.$or]
            }
            :
            {
                obj_id: myObj.obj_id,
                $or: [...myObj.$and]
            }
        return newReturn
    }
    else {
        if (myObj.hasOwnProperty('$and')) {
            return {
                ...myObj,
                $and: myObj.$and.map((item, index) => recurChangeAndOr(obj_id, val, item))
            }
        }
        else if (myObj.hasOwnProperty('$or')) {
            return {
                ...myObj,
                $or: myObj.$or.map((item, index) => recurChangeAndOr(obj_id, val, item))
            }
        }
        else {
            return myObj
        }
    }
}
async function handleChangeAndOr(obj_id, val, queryClient) {
    queryClient.setQueryData(['searchOption'], oldSearchOption => {
        return {
            ...oldSearchOption,
            metadata: oldSearchOption.metadata.map((item, index) => recurChangeAndOr(obj_id, val, item))
        }
    })
}
const MetaForm = (props) => {
    const antdTheme = theme.useToken()
    const myObj = props.myObj
    const treeHeight = props.treeHeight
    const currHeight = props.currHeight
    const cardWidth = props.cardWidth
    let queryClient = useQueryClient()
    if (Array.isArray(myObj)) {
        return (
            <>
                {myObj.map((item, index) =>
                    <div key={index}>
                        <MetaForm myObj={item} treeHeight={treeHeight} currHeight={currHeight} cardWidth={'fit-content'} />
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
                    style={{
                        border: `1px solid ${antdTheme.token.colorTextQuaternary}`,
                        minWidth: 482,
                        maxWidth: cardWidth
                    }}
                    title={
                        <div style={{ display: 'flex', columnGap: 8 }}>
                            <Button
                                style={{ width: 50 }}
                                size='small'
                                type="primary"
                                onClick={() => {
                                    if (myObj.hasOwnProperty('$and')) {
                                        handleChangeAndOr(myObj.obj_id, '$or', queryClient)
                                    }
                                    else {
                                        handleChangeAndOr(myObj.obj_id, '$and', queryClient)
                                    }
                                }}>
                                {myObj.hasOwnProperty('$and') ? 'AND' : 'OR'}
                            </Button>
                            <Button style={{
                                color: antdTheme.token.colorSuccess,
                                borderColor: antdTheme.token.colorSuccess,
                                backgroundColor: antdTheme.token.colorBgLayout
                            }} size="small" icon={<PlusOutlined />} onClick={() => { handleAddMetadata(myObj.obj_id, 'metadata', queryClient) }}>metadata</Button>
                            <Button style={{
                                color: antdTheme.token.colorWarning,
                                borderColor: antdTheme.token.colorWarning,
                                backgroundColor: antdTheme.token.colorBgLayout
                            }} size="small" icon={<PlusOutlined />} onClick={() => { handleAddMetadata(myObj.obj_id, 'inner', queryClient) }}>inner</Button>
                            <Button style={{
                                color: antdTheme.token.colorWarning,
                                borderColor: antdTheme.token.colorWarning,
                                backgroundColor: antdTheme.token.colorBgLayout
                            }} size="small" icon={<PlusOutlined />} onClick={() => { handleAddMetadata(myObj.obj_id, 'outer', queryClient) }}>outer</Button>
                        </div>
                    }
                    extra={
                        <>
                            <Button danger shape="circle" size='small' type='text' icon={<CloseCircleOutlined />}
                                onClick={() => handleDeleteMetadata(myObj.obj_id, queryClient)}
                            />
                        </>
                    }
                >
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                        {myObj.hasOwnProperty('$and')
                            ?
                            myObj.$and.map((item, index) =>
                                <div key={index}>
                                    <MetaForm myObj={item} treeHeight={treeHeight} currHeight={currHeight + 1} cardWidth={'100%'} />
                                </div>
                            )
                            :
                            myObj.$or.map((item, index) =>
                                <div key={index}>
                                    <MetaForm myObj={item} treeHeight={treeHeight} currHeight={currHeight + 1} cardWidth={'fit-content'} />
                                </div>)
                        }
                    </div>
                </Card>
            )
        }
        else if (myObj.hasOwnProperty('$not') || myObj.hasOwnProperty('key')) {
            return (
                <div style={{
                    display: 'flex', columnGap: 8, justifyContent: 'flex-start', alignItems: 'center'
                    // marginLeft: (treeHeight - currHeight) * 25
                }}>
                    <AutoComplete
                        style={{
                            width: 160,
                        }}
                        placeholder="key"
                        value={myObj.hasOwnProperty('$not') ? myObj.$not.key : myObj.key}
                        onChange={val => handleTypeKeyValue(myObj.obj_id, val, 'key', queryClient)}
                    />
                    <Button
                        style={{ width: 80 }}
                        onClick={() => {
                            if (myObj.hasOwnProperty('$not')) {
                                handleChangeIsNot(myObj.obj_id, 'is', queryClient)
                            }
                            else {
                                handleChangeIsNot(myObj.obj_id, 'isnot', queryClient)
                            }
                        }}>
                        {myObj.hasOwnProperty('$not') ? 'IS NOT' : 'IS'}
                    </Button>
                    <Input
                        value={myObj.hasOwnProperty('$not') ? myObj.$not.value : myObj.value}
                        onChange={e => handleTypeKeyValue(myObj.obj_id, e.target.value, 'value', queryClient)}
                        style={{ width: 160 }} placeholder='value' />
                    <Button shape="circle" type="text" icon={<CloseOutlined />} onClick={() => handleDeleteMetadata(myObj.obj_id, queryClient)} />
                </div>
            )
        }
    }

}

const Page_Search = (props) => {
    console.log('---------------render Page_Search----------------')
    // props
    // const searchOptionQuery = props.searchOptionQuery
    const searchResultQuery = props.searchResultQuery
    // const searchMutation = props.searchMutation
    const [inp, setInp] = useState('')
    const queryClient = useQueryClient()
    let antdTheme = theme.useToken()
    const searchOption = queryClient.getQueryData(['searchOption'])
    const searchResult = queryClient.getQueryData(['searchResult'])
    // const searchResult = searchResultQuery.data
    // ///////////////////////
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
    const leftTerm = 6
    const rightTerm = 18
    const columns = [
        {
            title: 'Document',
            width: '30%',
            render: (obj) => {
                return (
                    <div>
                        <Typography.Text>{obj.file_name}</Typography.Text>
                    </div>
                )
            }
        },
        {
            title: 'Metadata',
            width: '30%',
            render: (obj) => {
                return (
                    <div>
                        <Typography.Text>{obj.metadata[0].key}</Typography.Text>
                    </div>
                )
            }
        },
        {
            title: 'Information',
            render: (obj) => {
                return (
                    <div>
                        <Typography.Text>{obj.owner.full_name}</Typography.Text>
                    </div>
                )
            }
        },
    ];
    async function handleTableChange(obj) {
        // setTableParams({
        //     pagination,
        //     filters,
        //     ...sorter,
        // });
        let newSearchOption = {
            ...searchOption,
            pagination: {
                ...searchOption.pagination,
                current: obj.current,
                pageSize: obj.pageSize
            }
        }
        await queryClient.setQueryData(['searchOption'], newSearchOption)
        await searchResultQuery.refetch()
        // await searchMutation.mutateAsync(newSearchOption)
        // // `dataSource` is useless since `pageSize` changed
        // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        //     setData([]);
        // }
    };
    // HTMl
    return (
        searchOption
            ?
            <>
                < Bread title={"Search"} />
                <Container>
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
                                />}
                            // headStyle={{
                            //     paddingTop: 24,
                            //     paddingBottom: 24
                            // }}
                            >
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
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    {searchOption.metadata.length == 0 || searchOption.metadata[0].hasOwnProperty('key') || searchOption.metadata[0].hasOwnProperty('$not')
                                        ?
                                        <div style={{ marginBottom: 8, width: 456 }}>
                                            <Button style={{
                                                color: antdTheme.token.colorSuccess,
                                                borderColor: antdTheme.token.colorSuccess,
                                            }}
                                                size='small' icon={<PlusOutlined />} onClick={() => { handleAddMetadata(null, searchOption.metadata.length == 0 ? '1' : '2', queryClient) }}>metadata</Button>
                                        </div>
                                        : null
                                    }
                                    <MetaForm myObj={searchOption?.metadata} treeHeight={treeHeight} currHeight={1} cardWidth='fit-content' />
                                </div>
                            </Card>
                        </Col>
                        <Col span={24}>
                            {
                                searchMutation.isPending
                                    ? <Typography.Text>loading...</Typography.Text>
                                    : (searchMutation.isSuccess
                                        ? <Card>
                                            {searchResult?.documents.map((doc, index) => (
                                                <div style={{ width: 100 }}>
                                                    <Document file="/file/01-cp.signed.pdf">
                                                        <Page width={100} pageNumber={1} />
                                                    </Document>

                                                </div>
                                            ))}

                                        </Card>
                                        : null
                                    )
                            }
                        </Col> */}
                        {/* <Col span={24}>
                            <Page_Table />
                        </Col> */}
                        {/* /////////////////////////////////////////////////////////////////////////////// */}
                        <Col span={24}>
                            <Table
                                columns={columns}
                                rowKey={(record) => record.document_id}
                                dataSource={searchResult.documents}
                                pagination={searchResult.pagination}
                                loading={searchResultQuery.isFetching}
                                onChange={handleTableChange}
                                showHeader={false}
                            />
                        </Col>
                    </Row>
                </Container>
            </>
            : null
    )
}

export default Page_Search