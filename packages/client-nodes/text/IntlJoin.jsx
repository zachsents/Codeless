import { Select } from "@mantine/core"
import { AlphabetLatin } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components/index"


export default {
    id: "text:IntlJoin",
    name: "Join List to Text",
    description: "Converts a list into text.",
    icon: AlphabetLatin,
    tags: ["Text"],

    inputs: ["list"],
    outputs: ["text"],

    defaultState: {
        style: "long",
        type: "conjunction",
    },

    configuration: ({ state, setState }) => {

        return (
            <ControlStack>
                <Control>
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
                </Control>
                <Control>
                    <ControlLabel info="The type of list.">
                        List Type
                    </ControlLabel>
                    <Select
                        data={[
                            { label: "Conjunction", value: "conjunction" },
                            { label: "Disjunction", value: "disjunction" },
                            { label: "Unit", value: "unit" },
                        ]}
                        value={state.type}
                        onChange={type => setState({ type })}
                    />
                </Control>
            </ControlStack>
        )
    },
}