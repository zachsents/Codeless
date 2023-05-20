import { ActionIcon, Box } from "@mantine/core"
import { useNodeId, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { useAppContext, useFlowContext } from "@web/modules/context"
import { getNodeIntegrationsStatus } from "@web/modules/graph-util"
import { AnimatePresence, motion } from "framer-motion"
import { TbExclamationMark } from "react-icons/tb"


export default function ErrorIcon() {

    const typeDefinition = useTypeDefinition()

    const id = useNodeId()
    const { latestRun } = useFlowContext()
    const errors = latestRun?.errors?.[id]

    const { integrations: appIntegrations } = useAppContext()
    const nodeIntegrations = getNodeIntegrationsStatus(typeDefinition, appIntegrations)
    const integrationsSatisfied = nodeIntegrations.every(int => int.status.data)
    const integrationsLoading = nodeIntegrations.some(int => int.status.isLoading)

    return (
        <AnimatePresence>
            {(
                errors?.length > 0 ||
                (!integrationsSatisfied && !integrationsLoading)
            ) &&
                <Box className="absolute top-1 left-1 z-[5]">
                    <motion.div
                        initial={{ scale: 0, rotate: -135 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -135 }}
                        transition={{ duration: 0.1 }}
                    >
                        <ActionIcon
                            size="xs"
                            radius="sm"
                            variant="filled"
                            color="red.7"
                        >
                            <TbExclamationMark size={12} />
                        </ActionIcon>
                    </motion.div>
                </Box>}
        </AnimatePresence>
    )
}
