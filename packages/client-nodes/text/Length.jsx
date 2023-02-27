import { AlphabetLatin } from "tabler-icons-react"
import { SegmentedControl } from "@mantine/core"
import { Control, ControlLabel, ControlStack } from "../components/index"

import { useNodeState } from "@minus/graph-util"


export default {
    id: "text:Length",
    name: "Text Length",
    description: "Gives the length of text in either characters or words.",
    icon: AlphabetLatin,
    badge: "text",

    inputs: ["text"],
    outputs: ["count"],

    defaultState: {
        mode: "Character",
    },

    renderName: () => {
        const [state] = useNodeState()

        return `${state.mode} Count`
    },

    configuration: () => {

        const [state, setState] = useNodeState()

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="Determines whether words or characters are counted.">
                        Mode
                    </ControlLabel>
                    <SegmentedControl
                        value={state.mode}
                        onChange={mode => setState({ mode })}
                        data={[
                            { label: "Characters", value: "Character" },
                            { label: "Words", value: "Word" },
                        ]}
                    />
                </Control>
            </ControlStack>
        )
    },

}