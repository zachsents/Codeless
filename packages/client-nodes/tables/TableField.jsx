import { Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components/index"

import { useNodeState } from "@minus/graph-util"


export default {
    id: "tables:TableField",
    name: "Table Field",
    description: "Represents a field from a table. Useful for conditions and filtering involving table values.",
    icon: Table,
    color: "yellow",
    badge: "tables",

    inputs: [],
    outputs: ["$"],

    defaultState: {
        field: null,
    },

    renderName: () => {

        const [state] = useNodeState()

        return <Text color="dimmed">
            Table Field:&nbsp;
            {state.field ?
                <Text color="dark">"{state.field}"</Text> :
                <Text component="span" color="red">none</Text>}
        </Text>
    },

    configuration: () => {

        const [state, setState] = useNodeState()

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The name of the field or column you wish to target.">
                        Field Name
                    </ControlLabel>
                    <TextInput
                        placeholder="Field name"
                        value={state.field ?? ""}
                        onChange={event => setState({ field: event.currentTarget.value })}
                    />
                </Control>
            </ControlStack>
        )
    }
}