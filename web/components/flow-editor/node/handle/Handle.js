import { Box, Group, Text, useMantineTheme } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { Position, Handle as RFHandle } from "reactflow"

import { HandleType, useColors, useHandleConnected, useHandleDefinition } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName, useSmoothlyUpdateNode } from "@web/modules/graph-util"
import { jc } from "@web/modules/util"
import { useEffect } from "react"
import HandleTooltip from "./HandleTooltip"


export default function Handle({ id, label, nodeHovered, onHover }) {

    const theme = useMantineTheme()

    const { type, definition } = useHandleDefinition(null, id)
    const connected = useHandleConnected(null, id)

    const [mainColor, lightColor] = useColors(null, ["primary", 0])

    // Make label
    label ||= definition.name || formatHandleName(id)

    // Hover state -- need to pass up so other handles know when to show tooltip
    const { hovered, ref: hoverRef } = useHover()
    useEffect(() => {
        onHover?.(id, hovered)
    }, [hovered])

    // Side-effect: fix node internals when connected state changes
    useSmoothlyUpdateNode(null, [connected, hovered], { timeout: 100 })

    return (
        <Box pos="relative" ref={hoverRef}>
            <RFHandle
                id={id}
                type={type}
                position={type == HandleType.Input ? Position.Left : Position.Right}
                className="!relative !transform-none !inset-0 !w-auto !h-auto flex !rounded-full !border !border-1 transition-colors"
                style={{
                    backgroundColor: hovered ? lightColor : theme.colors.gray[0],
                    borderColor: hovered ? mainColor : theme.colors.gray[3],
                    color: hovered ? mainColor : theme.colors.gray[7],
                }}
            >
                <Group
                    noWrap spacing="xxxs" px="xxxs" py="0.1rem"
                    className={jc(
                        "w-full pointer-events-none",
                        type == HandleType.Output && "flex-row-reverse justify-end",
                    )}
                >
                    {definition.showHandleIcon && definition.icon &&
                        <definition.icon size="0.7rem" color="currentColor" />}

                    {label &&
                        <Text size="xxxs" color="currentColor">{label}</Text>}
                </Group>
            </RFHandle>

            <HandleTooltip
                id={id}
                label={label}
                nodeHovered={nodeHovered}
                handleHovered={hovered}
            />
        </Box>
    )
}
