import { Card, Center, Group, Textarea, useMantineTheme } from "@mantine/core"
import { AlphabetLatin, Dots, GridDots } from "tabler-icons-react"
import { useInternalState } from "../hooks/nodes.js"


/**
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition}
 */
export default {
    id: "basic:Text",
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,
    color: "gray",

    tags: ["Text", "Basics"],
    showMainTag: false,

    inputs: [],
    outputs: [
        {
            id: "$",
            name: "Text",
            description: "The text.",
            tooltip: "The text.",
            icon: AlphabetLatin,
        }
    ],

    renderCard: false,
    renderName: false,

    renderContent: () => {
        const theme = useMantineTheme()
        const [state, setState] = useInternalState()
        return (
            <Group spacing={0} py={5}>
                <Center px="xs">
                    <GridDots color={theme.colors.gray[5]} size="1em" />
                </Center>
                <Textarea
                    value={state.$ ?? ""}
                    onChange={event => setState({ $: event.currentTarget.value })}
                    placeholder="Type something..."
                    radius="md"
                    size="xs"
                    autosize
                    minRows={1}
                    maxRows={15}
                    w={200}
                    classNames={{
                        input: "nodrag"
                    }}
                />
            </Group>
        )
    },
}
