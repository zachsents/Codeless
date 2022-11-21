import { NumberInput, Stack } from "@mantine/core"
import { Dice3 } from "tabler-icons-react"

export default {
    name: "Random Number",
    description: "Generates a random number.",
    icon: Dice3,
    valueSources: [" "],

    expanded: () => <Stack spacing="xs">
        <NumberInput placeholder="1" label="Min" size="xs" radius="md" w={80} />
        <NumberInput placeholder="6" label="Max" size="xs" radius="md" w={80} />
    </Stack>
}