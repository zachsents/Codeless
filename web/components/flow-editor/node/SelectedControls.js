import { ActionIcon, Group, Popover, Tooltip, useMantineTheme } from "@mantine/core"
import { useDeleteNode, useNodeId, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { useCurrentlySelectedNode } from "@web/modules/graph-util"
import { TbMaximize, TbTrash } from "react-icons/tb"
import { useReactFlow } from "reactflow"


export default function SelectedControls({ children }) {

    const rf = useReactFlow()
    const theme = useMantineTheme()

    const nodeId = useNodeId()
    const typeDefinition = useTypeDefinition()

    const selectedNode = useCurrentlySelectedNode()
    const isSelected = selectedNode?.id === nodeId

    const fitView = () => {
        const node = rf.getNode(nodeId)
        rf.fitBounds({
            x: node.position.x,
            y: node.position.y,
            width: node.width,
            height: node.height,
        }, {
            duration: 400,
        })
    }

    const deleteNode = useDeleteNode()

    return (
        <Popover opened={isSelected} position="top" shadow="sm">
            <Popover.Target>
                {children}
            </Popover.Target>

            <Popover.Dropdown p={0}>
                <Group spacing={0}>

                    <Tooltip label="Focus">
                        <ActionIcon
                            size="lg" color="gray"
                            onClick={fitView}
                        >
                            <TbMaximize size={theme.fontSizes.lg} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Delete */}
                    {typeDefinition.deletable &&
                        <Tooltip label="Delete">
                            <ActionIcon
                                size="lg" color="red"
                                onClick={deleteNode}
                            >
                                <TbTrash size={theme.fontSizes.lg} />
                            </ActionIcon>
                        </Tooltip>}

                </Group>
            </Popover.Dropdown>
        </Popover>
    )
}
