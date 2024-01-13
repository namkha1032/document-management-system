// import packages
import { useQueryClient, useMutation, useMutationState } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Link } from "react-router-dom";
// import my components
import Bread from "../../components/Bread/Bread"
import Page_Table from "../Page_Table";
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
    theme,
    Table,
    Popover,
    Avatar,
    Pagination
} from "antd"
import Container from '@mui/material/Container';
// import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import {
    LaptopOutlined,
    PlusOutlined,
    CloseOutlined,
    CloseCircleOutlined,
    CloseCircleFilled,
    CloseCircleTwoTone,
    EllipsisOutlined,
    FileDoneOutlined,
    HddOutlined,
    UserOutlined,
    TeamOutlined,
    SearchOutlined
} from "@ant-design/icons"
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
const MetadataList = (props) => {
    const metaArray = props.metaArray
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', rowGap: 8 }}>
                {metaArray.map((item, index) => {
                    return (
                        <div key={index}>
                            <Typography.Text type={'secondary'}>{Object.entries(item)[0][0]}: </Typography.Text>
                            <Typography.Text>{Object.entries(item)[0][1]}</Typography.Text>
                        </div>)
                })}
            </div>
        </div>
    )
}
const Page_Search = (props) => {
    // props
    // const searchOptionQuery = props.searchOptionQuery
    // const searchResultQuery = props.searchResultQuery
    const searchMutation = props.searchMutation
    const [inp, setInp] = useState('')
    const queryClient = useQueryClient()
    let antdTheme = theme.useToken()
    const searchOption = queryClient.getQueryData(['searchOption'])
    const searchResult = queryClient.getQueryData(['searchResult'])
    async function handleAddKeyword(extendTerm, oriTerm, type) {
        await queryClient.setQueryData(['searchResult'], oldSearchResult => {
            const newBroader = type == 'broader'
                ? {
                    ...oldSearchResult.broader,
                    [oriTerm]: oldSearchResult.broader[oriTerm].filter(termItem => termItem != extendTerm)
                }
                : oldSearchResult.broader
            const newRelated = type == 'related'
                ? {
                    ...oldSearchResult.related,
                    [oriTerm]: oldSearchResult.related[oriTerm].filter(termItem => termItem != extendTerm)
                }
                : oldSearchResult.related
            const newNarrower = type == 'narrower'
                ? {
                    ...oldSearchResult.narrower,
                    [oriTerm]: oldSearchResult.narrower[oriTerm].filter(termItem => termItem != extendTerm)
                }
                : oldSearchResult.narrower
            return {
                ...oldSearchResult,
                broader: newBroader,
                related: newRelated,
                narrower: newNarrower
            }
        })
        await queryClient.setQueryData(['searchOption'], oldSearchOption => {
            const newBroader = type == 'broader'
                ? (
                    oldSearchOption.broader.hasOwnProperty(oriTerm)
                        ? {
                            ...oldSearchOption.broader,
                            [oriTerm]: [...oldSearchOption.broader[oriTerm], extendTerm]
                        }
                        : {
                            ...oldSearchOption.broader,
                            [oriTerm]: [extendTerm]
                        }
                )
                : oldSearchOption.broader
            const newRelated = type == 'related'
                ? (
                    oldSearchOption.related.hasOwnProperty(oriTerm)
                        ? {
                            ...oldSearchOption.related,
                            [oriTerm]: [...oldSearchOption.related[oriTerm], extendTerm]
                        }
                        : {
                            ...oldSearchOption.related,
                            [oriTerm]: [extendTerm]
                        }
                )
                : oldSearchOption.related
            const newNarrower = type == 'narrower'
                ? (
                    oldSearchOption.narrower.hasOwnProperty(oriTerm)
                        ? {
                            ...oldSearchOption.narrower,
                            [oriTerm]: [...oldSearchOption.narrower[oriTerm], extendTerm]
                        }
                        : {
                            ...oldSearchOption.narrower,
                            [oriTerm]: [extendTerm]
                        }
                )
                : oldSearchOption.narrower
            return {
                ...oldSearchOption,
                broader: newBroader,
                related: newRelated,
                narrower: newNarrower
            }
        })
    }
    async function handleChangeSearchScope(value) {
        queryClient.setQueryData(['searchOption'], oldSearchOption => {
            return {
                ...oldSearchOption,
                search_scope: value
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
    const searchResultsColumn = [
        {
            title: 'Document',
            width: '65%',
            render: (obj) => {
                let displayArray = []
                let extendArray = []
                let limit = 3
                if (obj.metadata.length > limit) {
                    displayArray = obj.metadata.slice(0, limit)
                    extendArray = obj.metadata.slice(limit)
                }
                else {
                    displayArray = [...obj.metadata]
                }
                return (
                    <Link to='#'>
                        <div style={{ display: 'flex', columnGap: 16 }}>
                            <div style={{ minWidth: 100, minHeighteight: 140 }}>
                                <Document file={obj.file_url}>
                                    <Page width={100} pageNumber={1} />
                                </Document>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                    {/* <FontAwesomeIcon icon="fa-solid fa-file-pdf" style={{ color: "#d7723c", }} /> */}
                                    <FontAwesomeIcon icon={icon({ name: 'file-pdf', style: 'solid' })} style={{ color: antdTheme.token.colorError, }} size="xl" />

                                    <Typography.Title style={{ marginTop: 0, marginBottom: 0, color: antdTheme.token.colorLink }} level={4}>{obj.file_name}</Typography.Title>

                                </div>
                                {/* <Typography.Paragraph ellipsis={{
                                    rows: 4
                                }}>
                                    {obj.content}
                                </Typography.Paragraph> */}
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', rowGap: 8, width: 'fit-content' }}>
                                    <MetadataList metaArray={displayArray} />
                                    <Popover placement="bottom" content={<MetadataList metaArray={extendArray} />} title="Other metadata">
                                        <Button icon={<EllipsisOutlined />} size='small' shape="round" style={{ height: 14, display: 'flex', alignItems: 'center' }} />
                                    </Popover>
                                </div>
                            </div>
                        </div >
                    </Link>
                )
            }
        },
        {
            title: 'Information',
            render: (obj) => {
                let todayiso = new Date(obj.created_date)
                let today = todayiso.toLocaleDateString()
                return (
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography.Title level={5} style={{ marginTop: 0 }}>Owner</Typography.Title>
                                <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                    <Avatar src={obj.owner.avatar} />
                                    <Typography.Text>{obj.owner.full_name}</Typography.Text>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 13 }}>File size</Typography.Title>
                                <Typography.Text>{obj.file_size}</Typography.Text>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 13 }}>Created date</Typography.Title>
                                <Typography.Text>{new Date(obj.created_date).toLocaleDateString()}</Typography.Text>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 13 }}>Updated date</Typography.Title>
                                <Typography.Text>{new Date(obj.updated_date).toLocaleDateString()}</Typography.Text>
                            </div>
                        </Col>
                    </Row>
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
        queryClient.setQueryData(['searchOption'], newSearchOption)
        await searchMutation.mutateAsync(newSearchOption)
        // // `dataSource` is useless since `pageSize` changed
        // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        //     setData([]);
        // }
    };
    async function handlePaginationChange(page, pageSize) {
        let newSearchOption = {
            ...searchOption,
            pagination: {
                ...searchOption.pagination,
                current: page,
                pageSize: pageSize
            }
        }
        queryClient.setQueryData(['searchOption'], newSearchOption)
        await searchMutation.mutateAsync(newSearchOption)
    }
    // logic
    let treeHeight = 0
    if (searchOption && searchOption.metadata.length > 0) {
        treeHeight = calculateTreeHeight(searchOption.metadata[0])
    }
    const leftTerm = 6
    const rightTerm = 18

    // HTMl
    return (
        searchOption
            ?
            <>
                <Bread title={
                    <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            Search in
                        </Typography.Title>
                        <Select
                            value={searchOption?.search_scope}
                            style={{
                                width: 200,
                            }}
                            size={'large'}
                            onChange={handleChangeSearchScope}
                            options={[
                                {
                                    value: 'all',
                                    label:
                                        <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                            <FileDoneOutlined />
                                            <Typography.Text>All</Typography.Text>
                                        </div>
                                },
                                {
                                    value: 'company',
                                    label:
                                        <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                            <HddOutlined />
                                            <Typography.Text>Company documents</Typography.Text>
                                        </div>
                                },
                                {
                                    value: 'my',
                                    label:
                                        <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                            <FileDoneOutlined />
                                            <Typography.Text>My documents</Typography.Text>
                                        </div>
                                },
                                {
                                    value: 'shared',
                                    label:
                                        <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                            <FileDoneOutlined />
                                            <Typography.Text>Shared documents</Typography.Text>
                                        </div>
                                },
                            ]}
                        />
                    </div>
                } />
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
                                {/* <Row gutter={[10, 10]}>
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
                                </Row> */}
                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 24 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                                        <Typography.Text strong>Broader terms: </Typography.Text>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                            {Object.entries(searchResult?.broader).map(([oriTerm, extendArray], index) =>
                                                extendArray.map((kw, index) =>
                                                    <Tag key={index} color='red' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(kw, oriTerm, 'broader')}>
                                                        {kw}
                                                    </Tag>))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                                        <Typography.Text strong>Related terms: </Typography.Text>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                            {Object.entries(searchResult?.related).map(([oriTerm, extendArray], index) =>
                                                extendArray.map((kw, index) =>
                                                    <Tag key={index} color='green' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(kw, oriTerm, 'related')}>
                                                        {kw}
                                                    </Tag>))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                                        <Typography.Text strong>Narrower terms: </Typography.Text>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8 }}>
                                            {Object.entries(searchResult?.narrower).map(([oriTerm, extendArray], index) =>
                                                extendArray.map((kw, index) =>
                                                    <Tag key={index} color='blue' style={{ cursor: 'pointer' }} onClick={() => handleAddKeyword(kw, oriTerm, 'narrower')}>
                                                        {kw}
                                                    </Tag>))}
                                        </div>
                                    </div>
                                </div>
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
                        {/* <Col span={24}>
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
                        <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                                <SearchOutlined
                                    style={{
                                        fontSize: 24,
                                        color: antdTheme.token.colorTextHeading
                                    }}
                                />
                                <Typography.Title level={2} style={{ margin: 0 }}>Search result</Typography.Title>
                            </div>
                            <Pagination
                                current={searchResult.pagination.current}
                                pageSize={searchResult.pagination.pageSize}
                                total={searchResult.pagination.total}
                                onChange={handlePaginationChange}
                            // showSizeChanger
                            // pageSizeOptions={[5, 8]}
                            />
                        </Col>
                        <Col span={24}>
                            <Table
                                columns={searchResultsColumn}
                                rowKey={(record) => record.document_id}
                                dataSource={searchResult.documents}
                                pagination={{
                                    ...searchResult.pagination,
                                    position: ['bottomCenter']
                                }}
                                // pagination={false}
                                loading={searchMutation.isPending}
                                onChange={handleTableChange}
                                showHeader={false}
                                style={{ borderRadius: 8 }}
                            />
                        </Col>
                    </Row>
                </Container>
            </>
            : null
    )
}

export default Page_Search