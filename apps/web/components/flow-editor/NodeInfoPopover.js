import { useReactFlow } from "reactflow"
import { Button, Group, HoverCard, Skeleton, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import { TbBook } from "react-icons/tb"

import { createNode } from "@minus/graph-util"


export default function NodeInfoPopover({ node, children }) {

    const theme = useMantineTheme()
    const reactFlow = useReactFlow()

    const handleAddNode = () => {
        const center = reactFlow.project({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
        reactFlow.addNodes(createNode(node.id, center))
    }

    return (
        <HoverCard
            width={320}
            offset={30}
            openDelay={750}
            closeDelay={200}
            position="right-start"
            // withArrow
            // arrowOffset={15}
            shadow={theme.shadows.lg}
            styles={{
                dropdown: { border: "none" },
                arrow: { border: "none" },
            }}
            withinPortal
        >
            <HoverCard.Target>
                {children}
            </HoverCard.Target>
            <HoverCard.Dropdown p="md">
                <Stack>
                    <Group position="apart">
                        <Title order={5}>{node.name}</Title>
                        <node.icon />
                    </Group>
                    <Text>
                        {node.description}
                    </Text>
                    <Skeleton height={100} />
                    <Group position="apart" mt={10}>
                        <Button radius="md" variant="subtle" leftIcon={<TbBook />}>View Guides</Button>
                        <Button onClick={handleAddNode} radius="md">Add to Flow</Button>
                    </Group>
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}
