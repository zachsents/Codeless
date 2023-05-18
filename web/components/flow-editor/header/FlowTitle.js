import { ActionIcon, Group, Text, Tooltip, useMantineTheme } from "@mantine/core"
import EditableText from "@web/components/EditableText"
import { useAppContext, useFlowContext } from "@web/modules/context"
import { useFlowRenaming } from "@web/modules/hooks"
import { TbPencil } from "react-icons/tb"


export default function FlowTitle() {

    const theme = useMantineTheme()

    const { app } = useAppContext()
    const { flow } = useFlowContext()

    // renaming flow
    const { isRenaming, startRenaming, onRename, onCancel: onRenameCancel } = useFlowRenaming(flow?.id)

    return app && flow && (
        <Group>
            {isRenaming ?
                <EditableText
                    highlight
                    initialValue={flow?.name}
                    onEdit={onRename}
                    onCancel={onRenameCancel}
                    size="xs"
                /> :
                <>
                    <Text size="md" weight={500} color={theme.primaryColor}>
                        {flow?.name}
                    </Text>
                    <Tooltip label="Rename Workflow">
                        <ActionIcon size="sm" onClick={startRenaming} variant="subtle">
                            <TbPencil size="0.75em" />
                        </ActionIcon>
                    </Tooltip>
                </>}
        </Group>
    )
}
