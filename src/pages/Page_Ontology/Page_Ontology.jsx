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
    const navigate = useNavigate()
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
    return (
        <>
            <Bread breadProp={[{ "title": "Ontology", "path": "/ontology" }]} createButtonType={"ontology"} />
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