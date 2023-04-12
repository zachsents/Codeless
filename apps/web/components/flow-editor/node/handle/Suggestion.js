import { Button, Text } from "@mantine/core"
import { motion } from "framer-motion"
import { TbPlus } from "react-icons/tb"

import { NodeDefinitions } from "@minus/client-nodes"
import { getHandleDefinition, getHandleDefinitionId } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName } from "@web/modules/graph-util"


export default function Suggestion({ nodeTypeDefId, handleId, showHandle = false, index, children, icon = <TbPlus />, ...props }) {

    const nodeTypeDef = NodeDefinitions[nodeTypeDefId]
    const definition = getHandleDefinition(nodeTypeDefId, getHandleDefinitionId(handleId))

    const label = definition.name || formatHandleName(handleId)

    return (
        <motion.div initial="hide" animate="show" variants={suggestionAnimVariants(index)} >
            <Button
                size="xs"
                compact
                variant="light"
                color="gray"
                leftIcon={icon}
                styles={suggestionStyles}
                {...props}
            >
                {nodeTypeDef &&
                    <Text size={10} weight={400}>
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

const suggestionStyles = ({
    inner: {
        justifyContent: "flex-start",
    }
})
