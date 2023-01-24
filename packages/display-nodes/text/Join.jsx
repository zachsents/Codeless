import { Switch, TextInput } from "@mantine/core"
import { AlphabetLatin } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components"


export default {
    id: "text:Join",
    name: "Join List to Text",
    description: "Converts a list into text.",
    icon: AlphabetLatin,
    badge: "Text",

    inputs: ["list"],
    outputs: ["text"],

    defaultState: {
        join: ", ",
        last: ", and ",
        useLast: true,
    },

    configuration: ({ state, setState }) => {

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The text your list items are joined by.">
                        Join Text
                    </ControlLabel>
                    <TextInput
                        value={state.join}
                        onChange={event => setState({ join: event.currentTarget.value })}
                        placeholder=","
                        radius="md"
                    />
                </Control>
                <Control>
                    <ControlLabel info='Specify this if you want the last item to be different. For example, "a, b, and c".'>
                        Different Last Item
                    </ControlLabel>
                    <Switch
                        checked={state.useLast}
                        onChange={event => setState({ useLast: event.currentTarget.checked })}
                    />
                    <TextInput
                        value={state.last}
                        onChange={event => setState({ last: event.currentTarget.value })}
                        placeholder=", and"
                        radius="md"
                        disabled={!state.useLast}
                    />
                </Control>
            </ControlStack>
        )
    },
}