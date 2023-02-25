import { Template } from "tabler-icons-react"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"


export default {
    id: "basic:Template",
    name: "Fill Template",
    description: "Inserts values into a template.",
    icon: Template,
    badge: "Text",

    inputs: [
        "template",
        {
            name: "data",
            list: true,
        }
    ],
    outputs: ["text"],

    defaultState: {
        dataLabels: [],
    },

    renderNode: ({ state, alignHandles, listHandles }) => {

        alignHandles("template")

        return <ListHandlesNodeContent
            handleName="data"
            listHandles={listHandles}
            alignHandles={alignHandles}
            state={state}
            arrowSide="in"
            emptyMessage="No variables"
        />
    },

    configuration: ({ state, setState, listHandles }) => {
        return (
            <ControlStack>
                <ListHandlesControl
                    handleName="data"
                    listHandles={listHandles}
                    state={state}
                    setState={setState}
                    controlTitle="Variable Names"
                    controlInfo="The names of the variables in the template. They will be filled in spots surrounded with curly braces. e.g. {FirstName}, {Email}"
                    addLabel="Add Variable"
                    inputPlaceholder="Variable Name"
                />
            </ControlStack>
        )
    }
}