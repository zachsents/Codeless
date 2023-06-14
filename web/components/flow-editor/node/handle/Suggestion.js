import { Button, Text } from "@mantine/core"
import { motion } from "framer-motion"

import { NodeDefinitions } from "@minus/client-nodes"
import { getHandleDefinition, getHandleDefinitionId } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName } from "@web/modules/graph-util"


export default function Suggestion({ nodeTypeDefId, handleId, showHandle = false, index, children, ...props }) {

    const nodeTypeDef = NodeDefinitions[nodeTypeDefId]
    const definition = getHandleDefinition(nodeTypeDefId, getHandleDefinitionId(handleId))

    const label = definition.name || formatHandleName(handleId)

    return (
        <motion.div initial="hide" animate="show" variants={suggestionAnimVariants(index)} >
            <Button
                size="xs" compact variant="light" color="gray" radius="sm"
                leftIcon={<nodeTypeDef.icon size="0.75em" />}
                className="bg-gray-200 transition-colors hover:base-border hover:bg-white hover:text-dark"
                classNames={{ icon: "mr-xxxs" }}
                {...props}
            >
                {nodeTypeDef &&
                    <Text size="xxxs" weight={400}>
                        {nodeTypeDef.name}{showHandle ? ` - ${label}` : ""}
                    </Text>}

                {children && <Text size={10} weight={400}>{children}</Text>}
            </Button>
        </motion.div>
    )
}


const suggestionAnimVariants = index => ({
    hide: { opacity: 0, y: -40 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.4,
            delay: index * 0.05,
        },
    },
})
