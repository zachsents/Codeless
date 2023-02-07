import { Select, Slider } from "@mantine/core"
import { SiOpenai } from "react-icons/si"
import { Control, ControlLabel, ControlStack } from "../components"
import { useDebouncedSynchronizedState } from "../hooks"

const DefaultTemperature = 0

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
        temperature: DefaultTemperature,
    },

    configuration: ({ state, setState }) => {

        const [temperature, setTemperature] = useDebouncedSynchronizedState(
            state.temperature,
            temperature => setState({ temperature }),
            100
        )

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The language model used to answer the prompt.">
                        Model
                    </ControlLabel>
                    <Select
                        data={[
                            { label: "Davinci Text 3 (recommended)", value: "text-davinci-003" },
                            { label: "Curie", value: "text-curie-001" },
                            { label: "Babbage", value: "text-babbage-001" },
                            { label: "Ada", value: "text-ada-001" },
                            { label: "Davinci Code 2", value: "code-davinci-002" },
                            { label: "Cushman Code 2", value: "code-cushman-001" },
                        ]}
                        value={state.model}
                        onChange={model => setState({ model })}
                    />
                </Control>

                <Control>
                    <ControlLabel info="How random the response should be.">
                        Randomness
                    </ControlLabel>
                    <Slider
                        value={temperature}
                        onChange={setTemperature}
                        min={0}
                        max={1}
                        step={0.01}
                        label={val => val.toFixed(2)}
                    />
                </Control>
            </ControlStack>
        )
    }
}