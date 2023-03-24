import { Slider } from "@mantine/core"
import { SiOpenai } from "react-icons/si"
import { Control, ControlLabel, ControlStack } from "../components/index"
import { useDebouncedSynchronizedState } from "../hooks"

const DefaultTemperature = 1

export default {
    id: "openai:AskGPT3",
    name: "ChatGPT",
    description: "Asks ChatGPT a prompt.",
    icon: SiOpenai,
    color: "dark",
    badge: "Open AI",

    inputs: ["prompt"],
    outputs: ["response"],

    defaultState: {
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