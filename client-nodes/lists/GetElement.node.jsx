import { BracketsContain, Numbers, Target } from "tabler-icons-react"
import NumberControl from "../components/NumberControl"
import { useInputValue } from "../hooks/nodes"
import { Button, Group, Stack } from "@mantine/core"


export default {
    id: "lists:GetElement",
    name: "Get Element",
    description: "Gets an element from a list.",
    icon: BracketsContain,

    tags: ["Lists"],

    inputs: [
        {
            id: "list",
            description: "The list.",
            tooltip: "The list.",
            icon: BracketsContain,
        },
        {
            id: "index",
            name: "Position",
            description: "The position of the element to get. The first element is at position 1.",
            tooltip: <>
                The position of the element to get. The first element is at position 1.<br /><br />
                To get the last element without knowing the length of the list, set this to 0.
            </>,
            icon: Numbers,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 1,
            renderConfiguration: props => {
                const [, setValue] = useInputValue(null, props.inputId)

                return <Stack spacing={"xs"}>
                    <NumberControl {...props} />
                    <Group position="center">
                        <Button size="xs" compact variant="subtle" onClick={() => setValue(1)}>
                            First Item
                        </Button>
                        <Button size="xs" compact variant="subtle" onClick={() => setValue(0)}>
                            Last Item
                        </Button>
                    </Group>
                </Stack>
            },
        },
    ],
    outputs: [
        {
            id: "element",
            description: "The element at the specified index.",
            tooltip: "The element at the specified index.",
            icon: Target,
        },
    ],
}