import { Select } from "@mantine/core"
import { SiOpenai } from "react-icons/si"
import { Control, ControlLabel, ControlStack } from "../components"


export default {
    id: "openai:AskGPT3",
    name: "Ask GPT",
    description: "Asks GPT a prompt.",
    icon: SiOpenai,
    color: "dark",
    badge: "Open AI",

    inputs: ["prompt"],
    outputs: ["response"],

    defaultState: {
        model: "text-davinci-003",
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack w={250}>
                <Control>
                    <ControlLabel info="The language model used to answer the prompt.">
                        Model
                    </ControlLabel>
                    <Select
                        data={[
                            { label: "Davinci Text 3 (recommended)", value: "text-davinci-003" },
                            { label: "Davinci Code 2", value: "code-davinci-002" },
                        ]}
                        value={state.model}
                        onChange={model => setState({ model })}
                    />
                </Control>
            </ControlStack>
        )
    }
}