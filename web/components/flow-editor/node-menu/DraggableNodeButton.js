import { Card, Center, Group, Menu, OptionalPortal, Stack, Text, useMantineTheme } from "@mantine/core"
import { useClickOutside, useWindowEvent } from "@mantine/hooks"
import { NodeDefinitions } from "@minus/client-nodes"
import { addNodeAtCenter, addNodeAtWindowPoint } from "@web/modules/graph-util"
import { jc } from "@web/modules/util"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { TbPin, TbPinnedOff } from "react-icons/tb"
import { useReactFlow } from "reactflow"


export default function DraggableNodeButton({
    id, showDescription = false,
    pinned = false, onPin, onUnpin,
    scaleOnHover = false, bgOnHover = false,
}) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const nodeDef = NodeDefinitions[id]

    // Ref for getting size of node
    const ref = useRef()

    // Dragging state -- null if not dragging
    const [dragStart, setDragStart] = useState(null)
    const dragging = dragStart != null

    // Track x, y, width & height for rendering within portal
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const width = useMotionValue(0)
    const height = useMotionValue(0)
    // Widths that get floored tend to cause text to wrap -- we'll add 1px to avoid that
    const biggerWidth = useTransform(width, w => w + 1)
    const biggerHeight = useTransform(height, h => h + 1)

    // Window events for dragging and ending dragging
    useWindowEvent("pointermove", event => {
        if (dragging) {
            x.set(event.clientX - dragStart.offsetX)
            y.set(event.clientY - dragStart.offsetY)
        }
    })

    useWindowEvent("pointerup", event => {
        if (dragging) {
            setDragStart(null)
            x.set(0)
            y.set(0)

            // If distance was insignificant, add node at center
            const dist = Math.sqrt(
                Math.pow(event.clientX - dragStart.x, 2) +
                Math.pow(event.clientY - dragStart.y, 2)
            )

            if (dist > 3)
                addNodeAtWindowPoint(rf, id, event.clientX, event.clientY)
            else
                addNodeAtCenter(rf, id)
        }
    })

    // Menu state
    const [menuOpened, setMenuOpened] = useState(false)
    const clickOutsideRef = useClickOutside(() => setMenuOpened(false), ["pointerdown"])

    return nodeDef && (
        // Wrapper maintains size in original position
        <motion.div
            style={{
                width: dragging ? width : "auto",
                height: dragging ? height : "auto",
            }}
            ref={clickOutsideRef}
        >
            {/* Render within portal to avoid issues inside scroll containers */}
            <OptionalPortal withinPortal={dragging}>
                <Menu opened={menuOpened} onChange={setMenuOpened} shadow="sm">
                    <Menu.Target>
                        <Card
                            withBorder pl="xxs" py="xxxs" pr="xs"
                            className={jc(
                                "pointer-events-auto nosel cursor-pointer",
                                dragging && "absolute top-0 left-0 z-100"
                            )}

                            component={motion.div}
                            onPointerDown={event => {
                                if (event.button !== 0) return // Only left click

                                const elPosition = ref.current?.getBoundingClientRect()
                                setDragStart({
                                    x: event.clientX,
                                    y: event.clientY,
                                    offsetX: event.clientX - elPosition.x,
                                    offsetY: event.clientY - elPosition.y,
                                })
                                x.set(elPosition.x)
                                y.set(elPosition.y)
                                width.set(ref.current?.offsetWidth)
                                height.set(ref.current?.offsetHeight)
                            }}

                            whileHover={{
                                ...(scaleOnHover && { scale: 1.05 }),
                                ...(bgOnHover && { backgroundColor: theme.colors.gray[0] })
                            }}
                            transition={{
                                scale: { duration: 0.1 },
                                backgroundColor: { duration: 0 },
                            }}
                            style={{
                                x, y,
                                width: dragging ? biggerWidth : "auto",
                                height: dragging ? biggerHeight : "auto",
                            }}
                            ref={ref}

                            onContextMenu={event => {
                                event.preventDefault()
                                setMenuOpened(true)
                            }}
                        >

                            <Stack spacing="xxxs">
                                <Group spacing="sm" noWrap>
                                    <Center>
                                        <nodeDef.icon strokeWidth={1.5} color={theme.colors[nodeDef.color][theme.fn.primaryShade()]} />
                                    </Center>
                                    <Text size="xs" weight={500}>{nodeDef.name}</Text>
                                </Group>

                                {showDescription &&
                                    <Text size="xxs" color="dimmed">
                                        {nodeDef.description}
                                    </Text>}
                            </Stack>
                        </Card>
                    </Menu.Target>

                    <Menu.Dropdown className="pointer-events-auto">
                        {pinned ?
                            <Menu.Item
                                icon={<TbPinnedOff />}
                                fz="xs" px="xs" py="xxxs"
                                onClick={() => onUnpin?.(id)}
                            >
                                Unpin
                            </Menu.Item> :
                            <Menu.Item
                                icon={<TbPin />}
                                fz="xs" px="xs" py="xxxs"
                                onClick={() => onPin?.(id)}
                            >
                                Pin
                            </Menu.Item>}
                    </Menu.Dropdown>
                </Menu>
            </OptionalPortal>
        </motion.div>
    )
}
