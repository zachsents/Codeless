import { motion } from "framer-motion"
import {Button, Text} from "@mantine/core"
import { TbPlus } from "react-icons/tb"

import { Nodes } from "../../../modules/nodes"


export default function Suggestion({ typeId, index, ...props }) {

    
    return (
        <motion.div initial="hide" animate="show" variants={suggestionAnimVariants(index)} >
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


const suggestionAnimVariants = index => ({
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
})

const suggestionStyles = ({
    inner: {
        justifyContent: "flex-start",
    }
})
