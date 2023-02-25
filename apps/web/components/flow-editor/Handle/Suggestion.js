import { motion } from "framer-motion"
import { Button, Text } from "@mantine/core"
import { TbPlus } from "react-icons/tb"

import { Nodes } from "../../../modules/nodes"
import { getHandleLabel } from "../../../modules/graph-util"
import { useMemo } from "react"


export default function Suggestion({ typeId, handle, index, children, icon, ...props }) {

    const handleLabel = useMemo(
        () => handle && getHandleLabel(typeId, handle),
        [handle]
    )

    return (
        <motion.div initial="hide" animate="show" variants={suggestionAnimVariants(index)} >
            <Button
                size="xs"
                compact
                variant="light"
                color="gray"
                leftIcon={icon || <TbPlus />}
                styles={suggestionStyles}
                {...props}
            >
                {typeId &&
                    <Text size={10} weight={400}>
                        {Nodes[typeId].name}{handle ? ` - ${handleLabel}` : ""}
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
