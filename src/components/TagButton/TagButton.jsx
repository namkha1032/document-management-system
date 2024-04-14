import { Tag } from "antd"

const TagButton = (props) => {
    const handleClick = props.handleClick ?? (() => { })
    const icon = props.icon
    const color = props.color
    const height = props.height ?? 48
    const width = props.width ?? '100%'
    return (
        <>
            <Tag icon={icon} color={color} onClick={() => { handleClick() }}
                style={{ borderRadius: 8, cursor: 'pointer', fontSize: 16, display: "flex", justifyContent: "center", alignItems: "center", columnGap: 8, width: width, height: height }}>
                {props.children}
            </Tag>
        </>
    )
}

export default TagButton