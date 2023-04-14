import { ActionIcon, Box, Center, Group, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { NodeDefinitions } from "@minus/client-nodes"
import { addNodeAtCenter, addNodeAtWindowPoint } from "@web/modules/graph-util"
import { useMonostable } from "@web/modules/hooks"
import { motion } from "framer-motion"
import { useState } from "react"
import { TbPin, TbPinnedOff } from "react-icons/tb"
import { useReactFlow } from "reactflow"
import styles from "./DraggableNodeButton.module.css"


export default function DraggableNodeButton({ id, pinned = false, onPin, onUnpin }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const node = NodeDefinitions[id]

    const mainColor = theme.colors[node.color][theme.primaryShade.light]
    const dimmedColor = theme.colors[node.color][3]

    // used to hide the pin icon when dragging
    const [dragging, setDragging] = useState(false)

    // used to put element back in original position when drag is finished
    const [resetting, resetPosition] = useMonostable()

    return node && (
        <motion.div
            drag
            dragSnapToOrigin
            whileDrag={{ zIndex: 100 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={(event, info) => {
                setDragging(false)
                resetPosition()
                addNodeAtWindowPoint(rf, id, info.point.x, info.point.y)
            }}

            style={resetting && { x: 0, y: 0 }}
        >
            {/* This needs to be a child of the motion.div above for the tap event to be cancelled by the drag event */}
            <Box pos="relative">
                <motion.div
                    onTap={() => addNodeAtCenter(rf, id)}
                    className={styles.button}
                    style={{ borderColor: mainColor }}
                >
                    <Group position="apart">
                        <Group spacing="0.5em" >
                            <node.icon size="1.2em" color={mainColor} />
                            <Text size="sm" weight={600} color={mainColor} transform="uppercase" ff="Rubik">
                                {node.name}
                            </Text>
                        </Group>
                        {/* {node.tags[0] && node.showMainTag &&
                            <Text size="sm" weight={500} color={dimmedColor} transform="uppercase" ff="Rubik">
                                {node.tags[0]}
                            </Text>} */}
                    </Group>
                </motion.div>

                {!dragging &&
                    <Center p={8} pos="absolute" right={0} top="50%" sx={{ transform: "translate(100%, -50%)" }}>
                        {pinned ?
                            <Tooltip label="Unpin" position="right">
                                <ActionIcon radius="sm" size="sm" onClick={() => onUnpin?.(id)}>
                                    <TbPinnedOff color={theme.colors.gray[theme.primaryShade.light]} />
                                </ActionIcon>
                            </Tooltip> :
                            <Tooltip label="Pin" position="right">
                                <ActionIcon radius="sm" size="sm" onClick={() => onPin?.(id)}>
                                    <TbPin color={theme.colors.gray[theme.primaryShade.light]} />
                                </ActionIcon>
                            </Tooltip>}
                    </Center>}
            </Box>
        </motion.div>
    )
}
