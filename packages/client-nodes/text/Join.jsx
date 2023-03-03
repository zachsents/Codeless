import { SegmentedControl, Select, Space, Switch, Text, TextInput } from "@mantine/core"
import { AlphabetLatin } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components/index"


const MODES = ["Auto", "Custom"]


export default {
    id: "text:Join",
    name: "Join Text",
    description: "Concatenates text or list items into text.",
    icon: AlphabetLatin,
    badge: "Text",

    inputs: [
        {
            name: "list",
            label: "Text or List",
        }
    ],
    outputs: ["text"],

    defaultState: {
        mode: MODES[0],

        // Auto
        style: "long",
        type: "conjunction",

        // Custom
        join: ", ",
        last: " and ",
        useLast: true,
    },

    configuration: ({ state, setState }) => {

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info={<>
                        <Text><b>Auto</b> will join a list in plain English.<br />Example: One, Two, and Three</Text>
                        <Space h="xs" />
                        <Text><b>Custom</b> allows you to use custom join characters.<br />Example: One | Two | Three</Text>
                    </>}>
                        Mode
                    </ControlLabel>
                    <SegmentedControl
                        data={MODES}
                        value={state.mode ?? MODES[0]}
                        onChange={mode => setState({ mode })}
                    />
                </Control>

                {state.mode == MODES[0] &&
                    <>
                        {/* <Control>
                            <ControlLabel info="The style of the list.">
                                List Style
                            </ControlLabel>
                            <Select
                                data={[
                                    { label: "Long", value: "long" },
                                    { label: "Short", value: "short" },
                                    { label: "Narrow", value: "narrow" },
                                ]}
                                value={state.style}
                                onChange={style => setState({ style })}
                            />
                        </Control> */}
                        <Control>
                            <ControlLabel info={<>
                                <Text><b>Conjunction</b> uses "and".<br />Example: One, Two, and Three</Text>
                                <Space h="xs" />
                                <Text><b>Disjunction</b> uses "or".<br />Example: One, Two, or Three</Text>
                            </>}>
                                List Type
                            </ControlLabel>
                            <Select
                                data={[
                                    { label: "Conjunction (and)", value: "conjunction" },
                                    { label: "Disjunction (or)", value: "disjunction" },
                                ]}
                                value={state.type}
                                onChange={type => setState({ type })}
                            />
                        </Control>
                    </>}

                {state.mode == MODES[1] &&
                    <>
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
                    </>}
            </ControlStack>
        )
    },
}