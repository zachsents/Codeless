import { Box, Center, Group, NumberInput, useMantineTheme } from "@mantine/core"
import { GridDots, Numbers } from "tabler-icons-react"
import { useInternalState } from "../hooks/nodes"

export default {
    id: "basic:Number",
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,
    color: "gray",

    tags: ["Math", "Basics"],
    showMainTag: false,

    inputs: [],
    outputs: [
        {
            id: "$",
            name: "Number",
            description: "The number.",
            tooltip: "The number.",
            icon: Numbers,
        }
    ],

    renderCard: false,
    renderName: false,

    renderContent: () => {
        const theme = useMantineTheme()
        const [state, setState] = useInternalState()
        return (
            <Group spacing={0} py={5} mr={2}>
                <Center px="xs">
                    <GridDots color={theme.colors.gray[5]} size="1em" />
                </Center>
                <NumberInput
                    value={state.$}
                    onChange={val => setState({ $: val })}
                    placeholder="Pick a number..."
                    size="lg"
                    w={220}
                    controls
                    classNames={{
                        input: "nodrag"
                    }}
                />
            </Group>
        )
    },
}
