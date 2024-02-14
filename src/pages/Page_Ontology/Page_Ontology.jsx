import { useContext, useState, useEffect } from "react";
import ModeThemeContext from "../../context/ModeThemeContext";
import { Link, useNavigate } from "react-router-dom";
import {
    Typography,
    Button,
    Table
} from "antd"
import {
    ShareAltOutlined
} from '@ant-design/icons';
import Bread from "../../components/Bread/Bread";
import { getAllOntologies } from "../../apis/ontologyApi";
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
                    <Typography.Text>{obj.count_edges}</Typography.Text>
                )
            }
        }
    ]
    return (
        <>
            <Bread breadProp={[{ "title": "Ontology", "path": "/ontology" }]} />
            {ontologies
                ? <>
                    <Table
                        columns={ontologyColumns}
                        rowKey={(record) => record.url}
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
                    <Typography.Text>loading...</Typography.Text>
                </>}
        </>
    )
}

export default Page_Ontology