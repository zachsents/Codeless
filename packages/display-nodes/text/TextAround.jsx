import { NumberInput, Switch, Text } from "@mantine/core"
import { Container } from "tabler-icons-react"
import { ControlStack, Control, ControlLabel } from "../components"


export default {
    id: "text:TextAround",
    name: "Text Around",
    description: "Gets the text surrounding a phrase.",
    icon: Container,
    badge: "text",

    inputs: [
        "text",
        {
            name: "target",
            label: "Target (Text or Regex)",
        }
    ],
    outputs: ["surroundingText"],

    defaultState: {
        reach: 100,
        onlyFirst: true,
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="How many characters to reach surrounding the target text.">
                        Reach
                    </ControlLabel>
                    <NumberInput
                        value={state.reach}
                        onChange={reach => setState({ reach })}
                        placeholder="100"
                        radius="md"
                        hideControls
                        rightSection={<Text size="xs" color="dimmed">characters</Text>}
                        rightSectionWidth={80}
                    />
                </Control>

                <Control>
                    <ControlLabel info="Whether or not it should only find the first occurrence.">
                        Only First Occurrence
                    </ControlLabel>
                    <Switch
                        checked={state.onlyFirst}
                        onChange={event => setState({ onlyFirst: event.currentTarget.checked })}
                    />
                </Control>
            </ControlStack>
        )
    }

}