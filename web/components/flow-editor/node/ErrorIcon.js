import { ActionIcon } from "@mantine/core"
import { useIntegrationAccounts, useNodeId } from "@minus/client-nodes/hooks/nodes"
import { useAppContext, useFlowContext } from "@web/modules/context"
import { AnimatePresence, motion } from "framer-motion"
import { TbExclamationMark } from "react-icons/tb"


export default function ErrorIcon() {

    const id = useNodeId()
    const { latestRun } = useFlowContext()
    const errors = latestRun?.errors?.[id]

    const { app } = useAppContext()
    const { missingSelections } = useIntegrationAccounts(null, app)

    return (
        <AnimatePresence>
            {(errors?.length > 0 || (app && missingSelections)) &&
                // <Box className="absolute top-1 right-1 z-[5]">
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
                // </Box>
            }
        </AnimatePresence>
    )
}
