import { useContext, useState, useEffect } from "react";
import Graph from "react-graph-vis";
import ModeThemeContext from "../../context/ModeThemeContext";
import {
    Typography,
    Button
} from "antd"
const Page_Ontology_Id = () => {
    let [ontology, setOntology] = useState(null)
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let AUTH = ("neo4j", "xPJefRcLVTarN1_kGJoDaCVRK8crW1FV1nApXqDiGbo")
    useEffect(() => {
        // let responseOntology = {
        //     nodes: [
        //         { id: "a", label: "Node a" },
        //         { id: "b", label: "Node b" },
        //         { id: "c", label: "Node c" },
        //         { id: "d", label: "Node d" },
        //         { id: "e", label: "Node e" }
        //     ],
        //     edges: [
        //         { from: "a", to: "b", id: "a-b" },
        //         { from: "a", to: "c", id: "a-c" },
        //         { from: "a", to: "d", id: "a-d" },
        //         { from: "b", to: "e", id: "b-e" },
        //         // { from: "e", to: "a" }
        //     ]
        // };
        let responseOntology = {
            "nodes": [
                {
                    "id": "Pháp luật",
                    "label": "Pháp luật"
                },
                {
                    "id": "hình sự",
                    "label": "hình sự"
                },
                {
                    "id": "xâm phạm con người",
                    "label": "xâm phạm con người"
                },
                {
                    "id": "an ninh quốc gia",
                    "label": "an ninh quốc gia"
                },
                {
                    "id": "tội phạm quân đội",
                    "label": "tội phạm quân đội"
                },
                {
                    "id": "tội phạm tư pháp",
                    "label": "tội phạm tư pháp"
                },
                {
                    "id": "tội phạm chức vụ",
                    "label": "tội phạm chức vụ"
                },
                {
                    "id": "xâm phạm hôn nhân và gia đình",
                    "label": "xâm phạm hôn nhân và gia đình"
                },
                {
                    "id": "xâm phạm sở hữu",
                    "label": "xâm phạm sở hữu"
                },
                {
                    "id": "tội phạm môi trường",
                    "label": "tội phạm môi trường"
                },
                {
                    "id": "tội phạm ma túy",
                    "label": "tội phạm ma túy"
                },
                {
                    "id": "chống mệnh lệnh",
                    "label": "chống mệnh lệnh"
                },
                {
                    "id": "đầu hàng địch",
                    "label": "đầu hàng địch"
                },
                {
                    "id": "cản trở đồng đội",
                    "label": "cản trở đồng đội"
                },
                {
                    "id": "báo cáo sai",
                    "label": "báo cáo sai"
                },
                {
                    "id": "đào ngũ",
                    "label": "đào ngũ"
                },
                {
                    "id": "ngược đãi tù binh",
                    "label": "ngược đãi tù binh"
                },
                {
                    "id": "phản bội Tổ quốc",
                    "label": "phản bội Tổ quốc"
                },
                {
                    "id": "lật đổ chính quyền",
                    "label": "lật đổ chính quyền"
                },
                {
                    "id": "gián điệp",
                    "label": "gián điệp"
                },
                {
                    "id": "khủng bố",
                    "label": "khủng bố"
                },
                {
                    "id": "trốn đi nước ngoài",
                    "label": "phá hoại chính sách"
                },
                {
                    "id": "tham nhũng",
                    "label": "tham nhũng"
                },
                {
                    "id": "tham ô",
                    "label": "tham ô"
                },
                {
                    "id": "hối lộ",
                    "label": "hối lộ"
                },
                {
                    "id": "lạm quyền",
                    "label": "lạm quyền"
                },
                {
                    "id": "đào nhiệm",
                    "label": "đào nhiệm"
                },
                {
                    "id": "nhục hình",
                    "label": "nhục hình"
                },
                {
                    "id": "bức cung",
                    "label": "bức cung"
                },
                {
                    "id": "sai lệch hồ sơ",
                    "label": "sai lệch hồ sơ"
                },
                {
                    "id": "che giấu tội phạm",
                    "label": "che giấu tội phạm"
                },
                {
                    "id": "cướp",
                    "label": "cướp"
                },
                {
                    "id": "tống tiền",
                    "label": "tống tiền"
                },
                {
                    "id": "cưỡng đoạt",
                    "label": "cưỡng đoạt"
                },
                {
                    "id": "cướp giật",
                    "label": "cướp giật"
                },
                {
                    "id": "trộm cắp",
                    "label": "trộm cắp"
                },
                {
                    "id": "lừa đảo",
                    "label": "lừa đảo"
                },
                {
                    "id": "chiếm giữ trái phép",
                    "label": "chiếm giữ trái phép"
                },
                {
                    "id": "sử dụng trái phép",
                    "label": "sử dụng trái phép"
                },
                {
                    "id": "cố ý làm hư hỏng",
                    "label": "cố ý làm hư hỏng"
                },
                {
                    "id": "vô ý gây thiệt hại",
                    "label": "vô ý gây thiệt hại"
                },
                {
                    "id": "sản xuất ma túy",
                    "label": "sản xuất ma túy"
                },
                {
                    "id": "tàng trữ ma túy",
                    "label": "tàng trữ ma túy"
                },
                {
                    "id": "vận chuyển ma túy",
                    "label": "vận chuyển ma túy"
                },
                {
                    "id": "mua bán ma túy",
                    "label": "mua bán ma túy"
                },
                {
                    "id": "sử dụng ma túy",
                    "label": "sử dụng ma túy"
                },
                {
                    "id": "gây ô nhiễm",
                    "label": "gây ô nhiễm"
                },
                {
                    "id": "chất thải nguy hại",
                    "label": "chất thải nguy hại"
                },
                {
                    "id": "lây lan dịch bệnh",
                    "label": "lây lan dịch bệnh"
                },
                {
                    "id": "hủy hoại thủy sản",
                    "label": "hủy hoại thủy sản"
                },
                {
                    "id": "hủy hoại rừng",
                    "label": "hủy hoại rừng"
                },
                {
                    "id": "xâm phạm nhân phẩm danh dự",
                    "label": "xâm phạm nhân phẩm danh dự"
                },
                {
                    "id": "làm nhục",
                    "label": "vu khống"
                },
                {
                    "id": "xâm phạm quyền tự do",
                    "label": "xâm phạm quyền tự do"
                },
                {
                    "id": "mua bán người",
                    "label": "mua bán người"
                },
                {
                    "id": "chiếm đoạt người",
                    "label": "chiếm đoạt người"
                },
                {
                    "id": "giam người trái pháp luật",
                    "label": "giam người trái pháp luật"
                },
                {
                    "id": "xâm phạm chỗ ở",
                    "label": "xâm phạm chỗ ở"
                },
                {
                    "id": "xâm phạm bí mật",
                    "label": "xâm phạm bí mật"
                },
                {
                    "id": "sai lệch kết quả bầu cử",
                    "label": "sai lệch kết quả bầu cử"
                },
                {
                    "id": "sa thải trái pháp luật",
                    "label": "sa thải trái pháp luật"
                },
                {
                    "id": "xâm phạm tính mạng",
                    "label": "xâm phạm tính mạng"
                },
                {
                    "id": "giết người",
                    "label": "giết người"
                },
                {
                    "id": "vượt quá giới hạn phòng vệ",
                    "label": "vượt quá giới hạn phòng vệ"
                },
                {
                    "id": "vứt bỏ con",
                    "label": "vứt bỏ con"
                },
                {
                    "id": "vô ý làm chết người",
                    "label": "vô ý làm chết người"
                },
                {
                    "id": "bức tử",
                    "label": "bức tử"
                },
                {
                    "id": "xúi giục tự sát",
                    "label": "xúi giục tự sát"
                },
                {
                    "id": "đe dọa giết người",
                    "label": "đe dọa giết người"
                },
                {
                    "id": "xâm phạm sức khỏe",
                    "label": "xâm phạm sức khỏe"
                },
                {
                    "id": "cố ý gây thương tích",
                    "label": "cố ý gây thương tích"
                },
                {
                    "id": "hành hạ",
                    "label": "hành hạ"
                },
                {
                    "id": "hiếp dâm",
                    "label": "hiếp dâm"
                },
                {
                    "id": "cưỡng dâm",
                    "label": "cưỡng dâm"
                },
                {
                    "id": "lây truyền HIV",
                    "label": "lây truyền HIV"
                },
            ],
            "edges": [
                {
                    "from": "Pháp luật",
                    "to": "hình sự",
                },
                {
                    "from": "hình sự",
                    "to": "xâm phạm con người",
                },
                {
                    "from": "hình sự",
                    "to": "tội phạm quân đội",
                },
                {
                    "from": "hình sự",
                    "to": "tội phạm chức vụ",
                },
                {
                    "from": "hình sự",
                    "to": "xâm phạm sở hữu",
                },
                {
                    "from": "hình sự",
                    "to": "tội phạm ma túy",
                },
                {
                    "from": "hình sự",
                    "to": "an ninh quốc gia",
                },
                {
                    "from": "hình sự",
                    "to": "tội phạm tư pháp",
                },
                {
                    "from": "hình sự",
                    "to": "xâm phạm hôn nhân và gia đình",
                },
                {
                    "from": "hình sự",
                    "to": "tội phạm môi trường",
                },
                {
                    "from": "tội phạm quân đội",
                    "to": "chống mệnh lệnh",
                },
                {
                    "from": "tội phạm quân đội",
                    "to": "đầu hàng địch",
                },
                {
                    "from": "tội phạm quân đội",
                    "to": "cản trở đồng đội",
                },
                {
                    "from": "tội phạm quân đội",
                    "to": "báo cáo sai",
                },
                {
                    "from": "tội phạm quân đội",
                    "to": "đào ngũ",
                },
                {
                    "from": "tội phạm quân đội",
                    "to": "ngược đãi tù binh",
                },
                {
                    "from": "tội phạm chức vụ",
                    "to": "tham nhũng",
                },
                {
                    "from": "tội phạm chức vụ",
                    "to": "tham ô",
                },
                {
                    "from": "tội phạm chức vụ",
                    "to": "hối lộ",
                },
                {
                    "from": "tội phạm chức vụ",
                    "to": "lạm quyền",
                },
                {
                    "from": "tội phạm chức vụ",
                    "to": "đào nhiệm",
                },
                {
                    "from": "an ninh quốc gia",
                    "to": "phản bội Tổ quốc",
                },
                {
                    "from": "an ninh quốc gia",
                    "to": "lật đổ chính quyền",
                },
                {
                    "from": "an ninh quốc gia",
                    "to": "gián điệp",
                },
                {
                    "from": "an ninh quốc gia",
                    "to": "khủng bố",
                },
                {
                    "from": "an ninh quốc gia",
                    "to": "trốn đi nước ngoài",
                },
                {
                    "from": "an ninh quốc gia",
                    "to": "phá hoại chính sách",
                },
                {
                    "from": "tội phạm tư pháp",
                    "to": "nhục hình",
                },
                {
                    "from": "tội phạm tư pháp",
                    "to": "bức cung",
                },
                {
                    "from": "tội phạm tư pháp",
                    "to": "sai lệch hồ sơ",
                },
                {
                    "from": "tội phạm tư pháp",
                    "to": "che giấu tội phạm",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "cướp",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "tống tiền",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "cưỡng đoạt",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "cướp giật",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "trộm cắp",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "lừa đảo",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "chiếm giữ trái phép",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "sử dụng trái phép",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "cố ý làm hư hỏng",
                },
                {
                    "from": "xâm phạm sở hữu",
                    "to": "vô ý gây thiệt hại",
                },
                {
                    "from": "xâm phạm hôn nhân và gia đình",
                    "to": "cưỡng ép kết hôn",
                },
                {
                    "from": "xâm phạm hôn nhân và gia đình",
                    "to": "tổ chức tảo hôn",
                },
                {
                    "from": "xâm phạm hôn nhân và gia đình",
                    "to": "loạn luân",
                },
                {
                    "from": "xâm phạm hôn nhân và gia đình",
                    "to": "ngược đãi gia đình",
                },
                {
                    "from": "tội phạm ma túy",
                    "to": "sản xuất ma túy",
                },
                {
                    "from": "tội phạm ma túy",
                    "to": "sản xuất ma túy",
                },
                {
                    "from": "tội phạm ma túy",
                    "to": "tàng trữ ma túy",
                },
                {
                    "from": "tội phạm ma túy",
                    "to": "vận chuyển ma túy",
                },
                {
                    "from": "tội phạm ma túy",
                    "to": "mua bán ma túy",
                },
                {
                    "from": "tội phạm ma túy",
                    "to": "sử dụng ma túy",
                },
                {
                    "from": "tội phạm môi trường",
                    "to": "gây ô nhiễm",
                },
                {
                    "from": "tội phạm môi trường",
                    "to": "chất thải nguy hại",
                },
                {
                    "from": "tội phạm môi trường",
                    "to": "lây lan dịch bệnh",
                },
                {
                    "from": "tội phạm môi trường",
                    "to": "hủy hoại thủy sản",
                },
                {
                    "from": "tội phạm môi trường",
                    "to": "hủy hoại rừng",
                },
                {
                    "from": "xâm phạm con người",
                    "to": "xâm phạm nhân phẩm danh dự",
                },
                {
                    "from": "xâm phạm con người",
                    "to": "xâm phạm tính mạng",
                },
                {
                    "from": "xâm phạm con người",
                    "to": "xâm phạm quyền tự do",
                },
                {
                    "from": "xâm phạm con người",
                    "to": "xâm phạm sức khỏe",
                },
                {
                    "from": "xâm phạm nhân phẩm danh dự",
                    "to": "làm nhục",
                },
                {
                    "from": "xâm phạm nhân phẩm danh dự",
                    "to": "vu khống",
                },
                {
                    "from": "xâm phạm quyền tự do",
                    "to": "mua bán người",
                },
                {
                    "from": "xâm phạm quyền tự do",
                    "to": "chiếm đoạt người",
                },
                {
                    "from": "xâm phạm quyền tự do",
                    "to": "giam người trái pháp luật",
                },
                {
                    "from": "xâm phạm quyền tự do",
                    "to": "xâm phạm chỗ ở",
                },
                {
                    "from": "xâm phạm quyền tự do",
                    "to": "xâm phạm bí mật",
                },
                {
                    "from": "xâm phạm quyền tự do",
                    "to": "sai lệch kết quả bầu cử",
                },
                {
                    "from": "xâm phạm quyền tự do",
                    "to": "sa thải trái pháp luật",
                },
                {
                    "from": "xâm phạm tính mạng",
                    "to": "giết người",
                },
                {
                    "from": "xâm phạm tính mạng",
                    "to": "vượt quá giới hạn phòng vệ",
                },
                {
                    "from": "xâm phạm tính mạng",
                    "to": "vứt bỏ con",
                },
                {
                    "from": "xâm phạm tính mạng",
                    "to": "vô ý làm chết người",
                },
                {
                    "from": "xâm phạm tính mạng",
                    "to": "bức tử",
                },
                {
                    "from": "xâm phạm tính mạng",
                    "to": "xúi giục tự sát",
                },
                {
                    "from": "xâm phạm tính mạng",
                    "to": "đe dọa giết người",
                },
                {
                    "from": "xâm phạm sức khỏe",
                    "to": "cố ý gây thương tích",
                },
                {
                    "from": "xâm phạm sức khỏe",
                    "to": "hành hạ",
                },
                {
                    "from": "xâm phạm sức khỏe",
                    "to": "hiếp dâm",
                },
                {
                    "from": "xâm phạm sức khỏe",
                    "to": "cưỡng dâm",
                },
                {
                    "from": "xâm phạm sức khỏe",
                    "to": "lây truyền HIV",
                },
            ]
        }
        setOntology(responseOntology)
    }, [])

    const options = {
        "layout": {
            "randomSeed": 69,
            "improvedLayout": true
        },
        "edges": {
            "color": modeTheme == "light" ? "#000000" : "#FFFFFF",
        },
        "height": "100%",
        nodes: {
            shape: 'box',
            mass: 2
        },
        // "physics": {
        //     "barnesHut": {
        //         "springConstant": 0,
        //         "avoidOverlap": 1
        //     }
        // }
    };

    const events = {
        click: (obj) => {
            console.log("vis: ", obj)
        }
    };
    function handleAddNode() {
        let newOntology = {
            nodes: [
                ...ontology.nodes,
                {
                    id: `${ontology.nodes.length}`,
                    label: `Node ${ontology.nodes.length}`
                }
            ],
            edges: [...ontology.edges]
        }
        setOntology(newOntology)
    }
    return (
        <>
            <Typography.Text>ontology</Typography.Text>
            {ontology ? <Graph
                graph={ontology}
                options={options}
                events={events}
            />
                : <Typography.Text>loading...</Typography.Text>
            }
            <Button onClick={handleAddNode} >Add node</Button>
        </>
    )
}

export default Page_Ontology_Id