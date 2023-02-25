import { SiOpenai } from "react-icons/si"
import { NumberInput, Text, TextInput } from "@mantine/core"

import { Control, ControlLabel, ControlStack, RequiresConfiguration } from "../components/index"


export default {
    id: "openai:Rate",
    name: "Rate with GPT",
    description: "Rates an aspect of a text input on the specified number scale.",
    icon: SiOpenai,
    color: "dark",
    badge: "Open AI",

    inputs: ["text"],
    outputs: ["rating"],

    defaultState: {
        property: null,
        scale: 10,
    },

    renderNode: ({ state, setState }) => {
        return (
            <RequiresConfiguration dependencies={[state.property, state.scale]}>
                <Text align="center">Rating <b>{state.property}</b> (0-{state.scale})</Text>
            </RequiresConfiguration>
        )
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info='The property of the text you want to rate. e.g. "urgency", "satisfaction"'>
                        Property
                    </ControlLabel>
                    <TextInput
                        placeholder="urgency, satisfaction, etc."
                        value={state.property}
                        onChange={event => setState({ property: event.currentTarget.value })}
                    />
                </Control>

                <Control>
                    <ControlLabel info="The scale you want to rate the text on. A value of 10 here provides a rating between 0 and 10.">
                        Scale
                    </ControlLabel>
                    <NumberInput
                        value={state.scale}
                        onChange={scale => setState({ scale })}
                        min={1}
                        error={!state.scale}
                    />
                </Control>
            </ControlStack>
        )
    },

}