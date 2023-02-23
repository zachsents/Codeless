import { useCallback, useState } from "react"
import { useOnSelectionChange } from "reactflow"
import { AnimatePresence, motion } from "framer-motion"
import { ScrollArea, Flex } from "@mantine/core"

import NodeConfig from "./NodeConfig"


export default function ConfigPanel() {

    const [selectedNode, setSelectedNode] = useState()

    // watch selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        if (nodes.length == 1 && edges.length == 0)
            setSelectedNode(nodes[0])
        else
            setSelectedNode(null)
    }, [])

    useOnSelectionChange({ onChange: onSelectionChange })

    // whether or not to show the panel -- in the future there may be other things that show it
    const show = !!selectedNode

    return (
        <AnimatePresence>
            {show && <motion.div
                initial={{ x: "120%" }}
                animate={{ x: 0 }}
                exit={{ x: "120%" }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                style={configContainerStyle}
            >
                <ScrollArea h="100%">
                    <Flex py="lg" pr="lg" direction="column" align="flex-end" justify="flex-start">
                        {selectedNode &&
                            <NodeConfig node={selectedNode} />}
                    </Flex>
                </ScrollArea>
            </motion.div>}
        </AnimatePresence>
    )
}


const configContainerStyle = ({
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
})

