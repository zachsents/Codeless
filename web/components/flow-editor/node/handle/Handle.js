import { Box } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { Position, Handle as RFHandle } from "reactflow"

import { HandleType, useColors, useHandleConnected, useHandleDefinition } from "@minus/client-nodes/hooks/nodes"
import { useSmoothlyUpdateNode } from "@web/modules/graph-util"
import { useEffect } from "react"
import styles from "./Handle.module.css"
import HandleTooltip from "./HandleTooltip"


export default function Handle({ id, label, nodeHovered, onHover }) {

    const { type, definition } = useHandleDefinition(null, id)
    const connected = useHandleConnected(null, id)

    const [mainColor, bgColor] = useColors(null, ["primary", 0])

    // hover state -- need to pass up so other handles know when to show tooltip
    const { hovered, ref: hoverRef } = useHover()
    useEffect(() => {
        onHover?.(id, hovered)
    }, [hovered])

    // side-effect: fix node internals when connected state changes
    useSmoothlyUpdateNode(null, [connected, hovered], { timeout: 100 })

    return (
        <Box pos="relative" ref={hoverRef}>

            <div className={`${styles.wrapper} ${connected ? styles.connected : ""}`}>
                <RFHandle
                    id={id}
                    type={type}
                    position={type == HandleType.Input ? Position.Left : Position.Right}
                    className={styles.handle}
                    style={{
                        backgroundColor: bgColor,
                        border: `1px solid ${mainColor}`,
                    }}
                >
                    {definition.showHandleIcon && !connected && definition.icon &&
                        <definition.icon size="0.7rem" color={mainColor} />}
                </RFHandle>
            </div>

            <HandleTooltip
                id={id}
                label={label}
                nodeHovered={nodeHovered}
                handleHovered={hovered}
            />
        </Box>
    )
}
