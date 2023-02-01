import { Box, useMantineTheme, Text } from "@mantine/core"
import { Handle } from "reactflow"
import { motion } from "framer-motion"
import { useRef } from "react"


export default function CustomHandle({ id, name, handleType, position, label, connected, align, showLabel = false }) {

    const theme = useMantineTheme()

    const variants = {
        hovered: { scale: 2.5 },
        unconnected: { scale: 1.3 },
    }

    const tooltipLabel = label ?? formatName(name)
    const unconnectedTarget = !connected && handleType == "target"

    // calculate alignment
    const wrapperRef = useRef()
    const alignHeight = align && (
        align.offsetTop + align.offsetHeight / 2 - wrapperRef.current?.offsetHeight / 2
    )

    // props to pass to RF Handle component
    const handleProps = {
        id,
        type: handleType,
        position,
        style: {
            ...handleStyle(theme),
            backgroundColor: unconnectedTarget ?
                theme.colors.red[8] :
                theme.colors.gray[5],
        },
    }

    return (
        <motion.div
            animate={unconnectedTarget ? "unconnected" : undefined}
            whileHover="hovered"
            style={handleWrapperStyle(alignHeight)}
            ref={wrapperRef}
        >
            <motion.div variants={variants} transition={{ type: "spring", duration: 0.15 }}>
                <Handle {...handleProps} />
            </motion.div>
            {showLabel && tooltipLabel &&
                <Box sx={tooltipContainerStyle(position)}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} >
                        <Text sx={tooltipStyle}>{tooltipLabel}{unconnectedTarget ? " (not connected)" : ""}</Text>
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
})

const signalStyle = theme => ({
    // backgroundColor: theme.colors.red[4],
})

const valueStyle = theme => ({
    backgroundColor: theme.colors.gray[5],
})

function formatName(name) {

    if (name.startsWith("_"))
        return ""

    return name
        .replace("$", "")
        .trim()
        .match(/[A-Z]?[^A-Z]+/g)
        ?.map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
        .join(" ") ?? ""
}

const handleWrapperStyle = align => ({
    borderRadius: "100%",
    padding: 7,
    position: align ? "absolute" : "relative",
    ...(align && {
        top: align,
    }),
})

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