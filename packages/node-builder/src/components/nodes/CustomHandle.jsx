import { Box, useMantineTheme } from "@mantine/core"
import { Handle } from "reactflow"
import { DataType } from "../../modules/dataTypes"


export default function CustomHandle({ name, dataType, handleType, position }) {
    
    const theme = useMantineTheme()
    
    return (
        <Box sx={handleWrapperStyle}>
            <Handle {...createHandleProps(theme, name, dataType, {
                type: handleType,
                position,
            })} />
        </Box>
    )
}


const handleSize = 8

const handleStyle = theme => ({
    position: "static",
    transform: "none",
    boxSizing: "content-box",
    width: handleSize,
    height: handleSize,
    border: "none",
    // outline: "3px solid " + (theme.other.editorBackgroundColor ?? theme.colors.gray[2])
    outline: "3px solid " + theme.other.editorBackgroundColor,
})

const signalStyle = theme => ({
    // backgroundColor: theme.colors.red[4],
})

const valueStyle = theme => ({
    backgroundColor: theme.colors.gray[5],
})

function createHandleProps(theme, name, dataType, props) {
    return {
        id: createHandleId(name, dataType),
        ...props,
        style: {
            ...handleStyle(theme),
            ...(dataType == DataType.Value && valueStyle(theme)),
            ...(dataType == DataType.Signal && signalStyle(theme)),
        }, 
    }
}

function createHandleId(name, dataType) {
    return `<${dataType}>${name}`
}


const handleWrapperStyle = theme => ({
    borderRadius: "100%",
    padding: 7,
    "&:hover > *": {
        transform: "scale(2.5) !important",
        outlineWidth: "1.5px !important",
    }
})