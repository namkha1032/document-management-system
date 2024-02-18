import { useContext, useState, useEffect } from "react";
import ModeThemeContext from "../../context/ModeThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Table,
    Modal,
    Upload,
    Popconfirm,
    Tabs,
    Input,
    Card,
    Skeleton
} from "antd"
import {
    ShareAltOutlined,
    PlusOutlined,
    UploadOutlined,
    CheckOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    CodeBlock,
    a11yDark,
    a11yLight,
    anOldHope,
    androidstudio,
    arta,
    atomOneDark,
    atomOneLight,
    codepen,
    dracula,
    far,
    github,
    googlecode,
    hopscotch,
    hybrid,
    irBlack,
    monoBlue,
    monokaiSublime,
    monokai,
    nord,
    noctisViola,
    obsidian,
    ocean,
    paraisoDark,
    paraisoLight,
    pojoaque,
    purebasic,
    railscast,
    rainbow,
    shadesOfPurple,
    solarizedDark,
    solarizedLight,
    sunburst,
    tomorrowNightBlue,
    tomorrowNightBright,
    tomorrowNightEighties,
    tomorrowNight,
    tomorrow,
    vs2015,
    xt256,
    zenburn
} from 'react-code-blocks';
import Bread from "../../components/Bread/Bread";
import { getAllOntologies, uploadOntologyFile, deleteOntology, createNewOntology } from "../../apis/ontologyApi";


const DeleteOntologyButton = (props) => {
    const ontology = props.ontology
    const setOntologies = props.setOntologies
    let [loadingDeleteOntology, setLoadingDeleteOntology] = useState(false)
    async function handleDeleteOntology() {
        setLoadingDeleteOntology(true)
        let deletedOntology = await deleteOntology(ontology.ontologyId)
        setOntologies((oldOntologies) => oldOntologies.filter((onto) => onto.ontologyId != deletedOntology.ontologyId))
        setLoadingDeleteOntology(false)
    }
    return (
        <Popconfirm
            title="Delete ontology"
            description={`Are you sure to delete this ontology - ${ontology.name}?`}
            onConfirm={handleDeleteOntology}
            onCancel={() => { }}
            okText="Yes"
            cancelText="No"
        >
            <Button loading={loadingDeleteOntology} danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
    )
}

const Page_Ontology = () => {
    let [ontologies, setOntologies] = useState(null)
    let [modalOpen, setModalOpen] = useState(false)
    let [fileList, setFileList] = useState([])
    let [newOntologyName, setNewOntologyName] = useState("")
    let [loadingCreateOntology, setLoadingCreateOntology] = useState(false)
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [createTab, setCreateTab] = useState("1")
    const navigate = useNavigate()
    let exampleJSON =
        `{
        "name": "Ontology name",
        "children": [
                {
                        "name": "Node A",
                        "children": [
                                {
                                        "name": "Node B"
                                },
                                {
                                        "name": "Node C"
                                }
                        ]
                }
        ]
}`
    useEffect(() => {
        async function fetchData() {
            let returnedOntologies = await getAllOntologies()
            setOntologies(returnedOntologies)
        }
        fetchData()
    }, [])
    let ontologyColumns = [
        {
            title: "Name",
            render: (obj) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", columnGap: 8, cursor: "pointer" }}
                        onClick={() => {
                            navigate(`/ontology/${obj.url}`, {
                                state: {
                                    breadState: [
                                        { "title": "Ontology", "path": "/ontology" },
                                        { "title": `${obj.name}`, "path": `/ontology/${obj.url}` }
                                    ]

                                }
                            })
                        }}>
                        <ShareAltOutlined />
                        <Typography.Text>{obj.name}</Typography.Text>
                    </div>
                )
            }
        },
        {
            title: "Number of nodes",
            render: (obj) => {
                return (
                    <Typography.Text>{obj.count_nodes}</Typography.Text>
                )
            }
        },
        {
            title: "Number of edges",
            render: (obj) => {
                return (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography.Text>{obj.count_edges}</Typography.Text>
                            <DeleteOntologyButton ontology={obj} setOntologies={setOntologies} />
                        </div>
                    </>
                )
            }
        }
    ]
    const createModalTab = [
        {
            key: '1',
            label: 'Create from scratch',
            children: <div>
                <Input placeholder="Enter ontology name" value={newOntologyName} onChange={(e) => { setNewOntologyName(e.target.value) }} />
            </div>,
        },
        {
            key: '2',
            label: 'Upload JSON file',
            children: <div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <Upload fileList={fileList} name={"file"} multiple={false}
                        beforeUpload={(file) => {
                            setFileList([
                                ...fileList,
                                file
                            ])
                            return false
                        }}
                        onRemove={(file) => {
                            const index = fileList.indexOf(file);
                            const newFileList = fileList.slice();
                            newFileList.splice(index, 1);
                            setFileList(newFileList);
                        }}
                    >
                        {fileList.length == 0
                            ? <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            : null
                        }
                    </Upload>
                </div>
                <Typography.Text>
                    Please upload your ontology as a JSON file that follows the below format:
                </Typography.Text>
                <CodeBlock
                    text={exampleJSON}
                    language={"javascript"}
                    showLineNumbers={false}
                    codeBlock={true}
                    // copied={true}
                    theme={modeTheme == "dark" ? anOldHope : monoBlue}
                // wrapLines
                />
            </div>,
        }
    ]
    async function handleUploadOntology() {
        setLoadingCreateOntology(true)
        const formData = new FormData();
        formData.append("ontology_file", fileList[0])
        let newOntology = await uploadOntologyFile(formData)
        navigate(`/ontology/${newOntology.url}`)
        setLoadingCreateOntology(false)
    }
    async function handleCreateOntology() {
        setLoadingCreateOntology(true)
        let newOntology = await createNewOntology({ name: newOntologyName })
        navigate(`/ontology/${newOntology.url}`)
        setLoadingCreateOntology(false)
    }
    return (
        <>
            <Modal style={{ top: 150 }} title="Create new ontology" open={modalOpen}
                maskClosable={true}
                okButtonProps={{
                    icon: < CheckOutlined />,
                    loading: loadingCreateOntology,
                    disabled: (fileList.length == 0 && createTab == "2") || (newOntologyName == "" && createTab == "1")
                }}
                okText={"Create"}
                onOk={createTab == "1" ? handleCreateOntology : handleUploadOntology}
                onCancel={() => { setModalOpen(false) }}>

                <Tabs animated={{ inkBar: true, tabPane: false }} activeKey={createTab} items={createModalTab} onChange={(key) => { setCreateTab(key) }} />
            </Modal >
            <Bread breadProp={[{ "title": "Ontology", "path": "/ontology" }]} createButtonType={"ontology"}
                CreateOntologyButton={<Button onClick={() => { setModalOpen(true) }} type="primary" icon={<PlusOutlined />} size={"large"}>
                    New ontology
                </Button>} />
            {
                ontologies
                    ? <>
                        <Table
                            columns={ontologyColumns}
                            rowKey={(record) => record.ontologyId}
                            dataSource={ontologies}
                            style={{ borderRadius: 8 }}
                        // loading={searchResult.loading}
                        // pagination={{
                        //     ...searchResult.pagination,
                        //     position: ['bottomCenter']
                        // }}
                        // pagination={false}
                        // onChange={handleTableChange}
                        />
                    </>
                    : <>
                        <Card style={{ height: "100%" }}>
                            <Skeleton active />
                        </Card>
                    </>
            }
        </>
    )
}

export default Page_Ontology