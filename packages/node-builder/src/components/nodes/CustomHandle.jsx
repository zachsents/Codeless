import { Box, useMantineTheme, Text } from "@mantine/core"
import { Handle } from "reactflow"
import { DataType } from "../../modules/dataTypes"
import { motion } from "framer-motion"


export default function CustomHandle({ name, dataType, handleType, position, label, showLabel = false }) {

    const theme = useMantineTheme()

    const variants = {
        hovered: { scale: 2.5 },
    }

    const tooltipLabel = label ?? formatName(name)

    return (
        <motion.div whileHover="hovered" style={handleWrapperStyle}>
            <motion.div variants={variants} transition={{ duration: 0.05 }}>
                <Handle {...createHandleProps(theme, name, dataType, {
                    type: handleType,
                    position,
                })} />
            </motion.div>
            {showLabel && tooltipLabel &&
                <Box sx={tooltipContainerStyle(position)}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} >
                        <Text sx={tooltipStyle}>{tooltipLabel}</Text>
                    </motion.div>
                </Box>}
        </motion.div>
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
    // outline: "3px solid " + theme.other.editorBackgroundColor,
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

function formatName(name) {
    return name
        .trim()
        .match(/[A-Z]?[^A-Z]+/g)
        ?.map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
        .join(" ") ?? ""
}

const handleWrapperStyle = {
    borderRadius: "100%",
    padding: 7,
    position: "relative",
}

const tooltipContainerStyle = position => ({
    position: "absolute",
    top: "50%",
    [position]: 0,
    transform: `translate(${position == "left" ? "-" : ""}100%, -50%)`,
})

const tooltipStyle = theme => ({
    fontSize: 10,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.dark[4],
    color: theme.colors.gray[0],
    padding: "2px 8px",
    whiteSpace: "nowrap",
})