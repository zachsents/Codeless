import { TextInput } from "@mantine/core"
import { Variable } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components/index"


export default {
    id: "basic:UseVariable",
    name: "Use Variable",
    description: "Outputs the value of a variable.",
    icon: Variable,

    inputs: [],
    outputs: ["$"],
    
    renderName: ({ state }) => state.name,

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The name of the variable. This must match the name in the corresponding Set Variable node.">
                        Variable Name
                    </ControlLabel>
                    <TextInput 
                        radius="md"
                        placeholder="Give me a name"
                        value={state.name}
                        onChange={event => setState({ name: event.currentTarget.value })}
                    />
                </Control>
            </ControlStack>
        )
    },
}