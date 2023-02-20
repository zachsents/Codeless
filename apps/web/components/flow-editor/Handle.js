import { forwardRef, memo, useRef } from "react"
import { Handle as RFHandle, Position } from "reactflow"
import { Box, useMantineTheme, Text, Stack, Button } from "@mantine/core"
import { motion } from "framer-motion"
import { TbPlus } from "react-icons/tb"
import { Nodes } from "../../modules/nodes"


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


Handle.Group = memo(forwardRef(({
    handles,
    direction,
    position,
    includeContainer = false,
    queryListHandle = () => 1,
    handleProps = {},
}, ref) => {

    const inferredPosition = direction == HandleDirection.Input ? Position.Left : Position.Right

    const handleElements = handles?.map(handle => {

        // handle can either be just a name or an object
        const { name, label, list, suggested } = typeof handle === "string" ? {
            name: handle,
            label: null,
            list: false,
            suggested: null,
        } : handle

        // if it's a list handle, get current number of handles
        const numberOfHandles = list ? queryListHandle(name) : 1

        // map out to elements
        return Array(numberOfHandles).fill(0).map((_, i) => {
            // include index in handle ID for list handles
            const handleId = list ? `${name}.${i}` : name

            return <Handle
                id={handleId}
                name={name}
                label={label}
                position={position ?? inferredPosition}
                direction={direction}
                suggested={suggested}
                // spread additional props to handle -- can be object or function
                {...(typeof handleProps == "function" ? handleProps(handleId) : handleProps)}
                key={handleId}
            />
        })
    }).flat() ?? <></>

    return includeContainer ?
        <Handle.VerticalContainer position={position ?? inferredPosition} ref={ref}>
            {handleElements}
        </Handle.VerticalContainer>
        :
        handleElements
}
))
Handle.Group.displayName = "Handle.Group"


Handle.VerticalContainer = forwardRef(({ children, position, ...props }, ref) => {
    return (
        <Stack
            justify="center"
            sx={stackStyle(position)}
            {...props}
        >
            <Stack
                justify="space-evenly"
                align="center"
                spacing={0}
                ref={ref}
            >
                {children}
            </Stack>
        </Stack>
    )
})
Handle.VerticalContainer.displayName = "Handle.VerticalContainer"


export const HandleDirection = {
    Input: "target",
    Output: "source",
}


function Suggestion({ typeId, index, ...props }) {

    const suggestionAnimVariants = {
        hide: { opacity: 0, y: -40 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                spring: 0.5,
                duration: 0.2,
                delay: index * 0.05 + 0.1,
            },
        },
    }

    return (
        <motion.div initial="hide" animate="show" variants={suggestionAnimVariants} >
            <Button
                size="xs"
                compact
                variant="light"
                color="gray"
                leftIcon={<TbPlus />}
                styles={suggestionStyles}
                {...props}
            >
                <Text size={10} weight={400}>{Nodes[typeId].name}</Text>
            </Button>
        </motion.div>
    )
}


const handleSize = 8


const stackStyle = position => ({
    position: "absolute",
    top: "50%",
    zIndex: 10,
    minHeight: "100%",

    ...(position == Position.Left && {
        left: 0,
        transform: "translate(-50%, -50%)",
    }),
    ...(position == Position.Right && {
        right: 0,
        transform: "translate(50%, -50%)",
    }),
})

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

const suggestionStyles = theme => ({
    inner: {
        justifyContent: "flex-start",
    }
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