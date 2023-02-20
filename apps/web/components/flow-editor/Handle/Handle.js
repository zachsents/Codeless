import { useRef } from "react"
import { Handle as RFHandle } from "reactflow"
import { Box, useMantineTheme, Text, Stack } from "@mantine/core"
import { motion } from "framer-motion"

import { Nodes } from "../../../modules/nodes"
import { HandleDirection } from "."
import Suggestion from "./Suggestion"


export default function Handle({ id, name, label, direction, position, suggested, onAddSuggested,
    connected, align, showLabel = false }) {

    const theme = useMantineTheme()

    // determine label -- prioritize label prop but fallback to formatted name
    const tooltipLabel = label ?? formatName(name)

    // unconnected inputs are styled special
    const isUnconnectedInput = !connected && direction == HandleDirection.Input

    // calculate alignment
    const wrapperRef = useRef()
    const alignHeight = align && (
        align.offsetTop + align.offsetHeight / 2 - wrapperRef.current?.offsetHeight / 2
    )

    // animation variants
    const handleAnimVariants = {
        hovered: { scale: 2.5 },
        unconnected: { scale: 1.3 },
    }

    return (
        <motion.div
            animate={isUnconnectedInput ? "unconnected" : undefined}
            whileHover="hovered"
            style={handleWrapperStyle(alignHeight)}
            ref={wrapperRef}
        >
            <motion.div variants={handleAnimVariants} transition={{ type: "spring", duration: 0.15 }}>
                <RFHandle
                    id={id}
                    type={direction}
                    position={position}
                    style={{
                        ...handleStyle,
                        backgroundColor: isUnconnectedInput ?
                            theme.colors.red[8] :
                            theme.colors.gray[5],
                    }}
                />
            </motion.div>
            {showLabel && (tooltipLabel || suggested) &&
                <Box sx={tooltipWrapperStyle(position)}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                        <Stack spacing={5} align="start" py="sm" ml={-15} pl={15}>
                            {tooltipLabel &&
                                <Text sx={tooltipStyle(false)}>{tooltipLabel}{isUnconnectedInput ? " (not connected)" : ""}</Text>}

                            {suggested && <>
                                <Text size={8} color="dimmed" mt={3} mb={-2}>Suggested Nodes</Text>

                                {suggested?.map(
                                    (suggestion, i) => {
                                        // suggestion can either be just a node type ID or an object

                                        const { node, handle } = typeof suggestion === "string" ? {
                                            node: suggestion,
                                            handle: Nodes[suggestion]?.inputs?.[0]?.name ?? Nodes[suggestion]?.inputs?.[0],
                                        } : suggestion

                                        return <Suggestion
                                            typeId={node}
                                            onClick={() => onAddSuggested?.(node, handle)}
                                            index={i}
                                            key={i}
                                        />
                                    }
                                )}
                            </>}
                        </Stack>
                    </motion.div>
                </Box>}
        </motion.div>
    )
}


const handleSize = 8


const handleWrapperStyle = align => ({
    borderRadius: "100%",
    padding: 7,
    position: align ? "absolute" : "relative",
    ...(align && {
        top: align,
    }),
})

const handleStyle = ({
    position: "static",
    transform: "none",
    boxSizing: "content-box",
    width: handleSize,
    height: handleSize,
    border: "none",
})

const tooltipWrapperStyle = position => theme => ({
    position: "absolute",
    top: "50%",
    [position]: 0,
    transform: `translate(${position == "left" ? "-" : ""}100%, -${theme.spacing.sm + 10}px)`,
})

const tooltipStyle = (button = false) => theme => ({
    fontSize: 10,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.dark[4],
    color: theme.colors.gray[0],
    padding: "2px 8px",
    whiteSpace: "nowrap",

    "&:hover": button ? {
        backgroundColor: theme.colors.dark[5],
    } : {},
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