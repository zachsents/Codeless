import { Center, Group, SimpleGrid, Switch, Text, TextInput } from "@mantine/core"
import { Regex } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components"


export default {
    id: "text:Regex",
    name: "Regex",
    description: "Creates a Regex.",
    icon: Regex,
    badge: "Text",

    inputs: [],
    outputs: ["$"],

    defaultState: {
        $: "",
        flags: {
            d: false,
            g: false,
            i: false,
            m: false,
            s: false,
            u: false,
            y: false,
        },
    },

    renderNode: ({ state, alignHandles }) => {

        const flags = Object.entries(state.flags ?? {})
            .filter(([, enabled]) => enabled)
            .map(([flag]) => flag)
            .join("")

        return <Center ref={el => alignHandles("$", el)}>
            <Text color="dimmed">/</Text>
            <Text>{state.$}</Text>
            <Text color="dimmed">/{flags}</Text>
        </Center>
    },

    configuration: ({ state, setState }) => {

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The Regex pattern.">
                        Pattern
                    </ControlLabel>
                    <TextInput
                        value={state.$}
                        onChange={event => setState({ $: event.currentTarget.value })}
                        placeholder="Some [rR]egex pat.ern\.\.\."
                        radius="md"
                    />
                </Control>

                <Control>
                    <ControlLabel info="Regex flags.">
                        Flags
                    </ControlLabel>

                    <SimpleGrid cols={2} spacing="xl" verticalSpacing="xs">
                        <FlagControl flag="d" state={state} setState={setState} />
                        <FlagControl flag="g" state={state} setState={setState} />
                        <FlagControl flag="i" state={state} setState={setState} />
                        <FlagControl flag="m" state={state} setState={setState} />
                        <FlagControl flag="s" state={state} setState={setState} />
                        <FlagControl flag="u" state={state} setState={setState} />
                        <FlagControl flag="y" state={state} setState={setState} />
                    </SimpleGrid>
                </Control>
            </ControlStack>
        )
    },
}


function FlagControl({ flag, state, setState }) {

    return (
        <Group position="apart" pr="lg">
            <Text>{flag}</Text>
            <Switch
                checked={state.flags[flag]}
                onChange={event => setState({
                    flags: {
                        ...state.flags,
                        [flag]: event.currentTarget.checked
                    }
                })}
            />
        </Group>
    )
}