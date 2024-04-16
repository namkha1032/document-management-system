import { Tag } from "antd"

const TagButton = (props) => {
    const handleClick = props.handleClick ?? (() => { })
    const icon = props.icon
    const color = props.color
    const height = props.height ?? 48
    const width = props.width ?? '100%'
    const borderRadius = props.borderRadius ?? 8
    const fontSize = props.fontSize ?? 16
    const borderWidth = props.borderWidth ?? 1
    const marginLeft = props.marginLeft ?? 0
    const columnGap = props.columnGap ?? 0
    return (
        <>
            <Tag className="tagButton" icon={icon} color={color} onClick={() => { handleClick() }}
                style={{
                    transition: "width 0.3s, height 0.3s", overflow: "hidden", borderRadius: borderRadius, borderWidth: borderWidth,
                    cursor: 'pointer', fontSize: fontSize, display: "flex", justifyContent: "center", alignItems: "center",
                    width: width, height: height, marginLeft: marginLeft, marginRight: 0, padding: 0, columnGap: columnGap
                }}>
                {props.children}
            </Tag>
        </>
    )
}

export default TagButton