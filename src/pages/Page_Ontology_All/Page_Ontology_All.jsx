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
    Skeleton,
    theme,
    Result
} from "antd"
import {
    ShareAltOutlined,
    PlusOutlined,
    UploadOutlined,
    CheckOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import Bread from "../../components/Bread/Bread";
import { getAllOntologiesNew, uploadOntologyFile, deleteOntology, createNewOntology } from "../../apis/ontologyApi";
import SearchOptionContext from "../../context/SearchOptionContext";
import OntologyAllContext from "../../context/OntologyAllContext";
const DeleteOntologyButton = (props) => {
    const ontology = props.ontology
    let [ontologyAll, dispatchOntologyAll] = useContext(OntologyAllContext)
    let [loadingDeleteOntology, setLoadingDeleteOntology] = useState(false)
    async function handleDeleteOntology() {
        setLoadingDeleteOntology(true)
        let deletedOntology = await deleteOntology(ontology.ontologyId)
        let newOntologies = ontologyAll.filter((onto) => onto.ontologyId != deletedOntology.ontologyId)
        dispatchOntologyAll({ type: "update", payload: newOntologies })
        setLoadingDeleteOntology(false)
    }
    return (
        <Popconfirm
            title="Delete ontology"
            description={`Are you sure to delete this ontology - ${ontology.ontologyName}?`}
            onConfirm={handleDeleteOntology}
            onCancel={() => { }}
            okText="Yes"
            cancelText="No"
        >
            <Button disabled={ontology.ontologyId = "4:6189104e-54a2-4243-81ac-77508424ea24:0"} loading={loadingDeleteOntology} danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
    )
}

const Page_Ontology_All = () => {
    let [ontologyAll, dispatchOntologyAll] = useContext(OntologyAllContext)
    let [searchOption, dispatchSearchOption] = useContext(SearchOptionContext)
    let antdTheme = theme.useToken()
    const navigate = useNavigate()
    let ontologyColumns = [
        {
            title: "Name",
            render: (obj) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", columnGap: 8, cursor: "pointer" }}
                        onClick={() => {
                            navigate(`/ontology/${obj.ontologyId}`, {
                                state: {
                                    breadState: [
                                        { "title": "Ontology", "path": "/ontology" },
                                        { "title": `${obj.ontologyName}`, "path": `/ontology/${obj.ontologyId}` }
                                    ]

                                }
                            })
                        }}>
                        <ShareAltOutlined />
                        <Typography.Text>{obj.ontologyName}</Typography.Text>
                    </div>
                )
            }
        },
        {
            title: "Number of synsets",
            render: (obj) => {
                return (
                    <Typography.Text>{obj.count_syn}</Typography.Text>
                )
            }
        },
        {
            title: "Number of senses",
            render: (obj) => {
                return (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography.Text>{obj.count_sense}</Typography.Text>
                            <DeleteOntologyButton ontology={obj} />
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
                ontologyAll
                    ? <>
                        <Table
                            columns={ontologyColumns}
                            rowKey={(record) => record.ontologyId}
                            dataSource={ontologyAll}
                            style={{
                                borderRadius: 8, cursor: "pointer",
                                border: `1px solid ${antdTheme.token.colorBorder}`
                            }}
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
                        <div style={{ height: "100%", width: "100%" }}>
                            <Skeleton.Button active block className="mySkele" />
                        </div>
                    </>
            }
        </>
    )
}

export default Page_Ontology_All