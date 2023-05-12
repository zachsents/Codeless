import { ActionIcon, Tooltip } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import { NodeDefinitions } from "@minus/client-nodes"
import { useStoreProperty } from "@minus/client-nodes/hooks/nodes"
import { useUserPreferences } from "@minus/client-sdk"
import { openNodePalette as _openNodePalette, addNodeAtWindowPoint } from "@web/modules/graph-util"
import { AnimatePresence, motion } from "framer-motion"
import { TbPlus } from "react-icons/tb"
import { useReactFlow } from "reactflow"
import styles from "./PaneContextMenu.module.css"


export default function PaneContextMenu() {

    const rf = useReactFlow()

    const [menu, setMenu] = useStoreProperty("paneContextMenu")
    const closeMenu = func => () => {
        func?.()
        setMenu({ ...menu, opened: false })
    }

    // close menu on click outside
    const clickOutsideRef = useClickOutside(closeMenu(), ["click"])

    // user preferences
    const [preferences] = useUserPreferences()
    const showingPinned = preferences?.pinned?.slice(0, 8)

    // handle opening node palette -- add where clicked
    const openNodePalette = () => _openNodePalette(rf, {
        innerProps: {
            onAdd: nodeType => addNodeAtWindowPoint(rf, nodeType.id, menu?.x + 80, menu?.y + 80)
        }
    })

    // handle adding node -- add where clicked
    const handleAddNode = nodeId => event => {
        addNodeAtWindowPoint(rf, nodeId, event.clientX, event.clientY)
        closeMenu()()
    }

    return (
        <div
            style={{ "--x": menu?.x + "px", "--y": menu?.y + "px" }}
            className={`${styles.container} ${menu?.opened ? styles.opened : ""}`}
            ref={clickOutsideRef}
        >
            <AnimatePresence>
                {menu?.opened &&
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <ActionIcon
                            onClick={closeMenu(openNodePalette)}
                            size={60} color="" variant="filled" radius="xl"
                            className={styles.plusButton}
                        >
                            <TbPlus size={20} />
                        </ActionIcon>

                        <div className={styles.buttonContainer}>
                            {showingPinned?.map((nodeId, i) =>
                                <NodeButton
                                    id={nodeId}
                                    index={i}
                                    total={showingPinned?.length ?? 0}
                                    onClick={handleAddNode(nodeId)}
                                    key={nodeId}
                                />
                            )}
                        </div>
                    </motion.div>}
            </AnimatePresence>
        </div>
    )
}


function NodeButton({ id, index, total, ...props }) {

    const node = NodeDefinitions[id]

    const radius = 80

    // calculate angle so that they are arranged in a circle
    // - 0.25 is to start at the top
    const angle = (index / total - 0.25) * Math.PI * 2

    // calculate x and y position of button
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    const variants = {
        start: { x: 0, y: 0, scale: 0.8 },
        end: { x, y, scale: 1 },
    }

    return <motion.div
        variants={variants}
        initial="start"
        animate="end"
        transition={{
            delay: 0.15,
            type: "spring",
            duration: 0.3,
            bounce: 0.3,
        }}
    >
        <div className={styles.buttonWrapper}>
            <Tooltip label={node.name} withinPortal>
                <ActionIcon color={node.color} variant="filled" size="xl" className={styles.nodeButton} {...props}>
                    <node.icon />
                </ActionIcon>
            </Tooltip>
        </div>
    </motion.div>
}