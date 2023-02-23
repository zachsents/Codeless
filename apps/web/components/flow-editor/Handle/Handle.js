import { useEffect, useRef } from "react"
import { Handle as RFHandle } from "reactflow"
import { Box, useMantineTheme, Text, Stack } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { AnimatePresence, motion } from "framer-motion"

import { HandleDirection } from "."
import Suggestion from "./Suggestion"


export default function Handle({ id, name, label, direction, position, suggestions, onAddSuggested,
    connected, align, nodeHovered = false, onHover }) {

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

    // entire container hover -- pass state up as well
    const { hovered, ref: hoverRef } = useHover()
    useEffect(() => {
        onHover?.(hovered)
    }, [hovered])

    return (
        <Box sx={containerStyle(alignHeight)} ref={hoverRef}>

            <motion.div
                animate={isUnconnectedInput ? "unconnected" : undefined}
                whileHover="hovered"
                style={handleWrapperStyle}
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
            </motion.div>

            <AnimatePresence>
                {(nodeHovered || hovered) && (tooltipLabel || suggestions) &&
                    <Box sx={tooltipWrapperStyle(position)}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                            transition={{ duration: 0.2 }}
                        >
                            <Stack spacing={5} align={position == "left" ? "end" : "start"} p={tooltipPadding} >

                                {tooltipLabel &&
                                    <Text sx={tooltipStyle(false)}>{tooltipLabel}{isUnconnectedInput ? " (not connected)" : ""}</Text>}

                                {suggestions &&
                                    <Text size={8} color="dimmed" mt={3} mb={-2} sx={{ whiteSpace: "nowrap" }}>
                                        {hovered ?
                                            "Suggested Nodes:" :
                                            `${suggestions.length} Suggested Node${suggestions.length == 1 ? "" : "s"}`}
                                    </Text>}

                                {hovered && suggestions?.slice(0, 3).map((suggestion, i) =>
                                    <Suggestion
                                        typeId={suggestion.node}
                                        onClick={() => onAddSuggested?.(suggestion.node, suggestion.handle, direction, hoverRef.current?.offsetTop)}
                                        index={i}
                                        key={i}
                                    />
                                )}
                            </Stack>
                        </motion.div>
                    </Box>}
            </AnimatePresence>

        </Box>
    )
}




/* Container */

const containerStyle = align => ({
    position: align ? "absolute" : "relative",
    ...(align && {
        top: align,
    }),
})


/* Handle */

const handleSize = 8

const handleWrapperStyle = {
    padding: 7,
    borderRadius: "50%",
    position: "relative",
    zIndex: 1,
}

const handleAnimVariants = {
    hovered: { scale: 2.5 },
    unconnected: { scale: 1.3 },
}

const handleStyle = ({
    position: "static",
    transform: "none",
    boxSizing: "content-box",
    width: handleSize,
    height: handleSize,
    border: "none",
})


/* Tooltip */

const tooltipPadding = "md"

const tooltipWrapperStyle = position => theme => {
    const xTransform = `calc(${position == "left" ? "-100%" : "100%"
        } ${position == "left" ? "+" : "-"} ${theme.spacing[tooltipPadding]}px)`

    return {
        position: "absolute",
        top: "50%",
        [position]: 0,
        transform: `translate(${xTransform}, -${theme.spacing[tooltipPadding] + 10}px)`,
    }
}

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