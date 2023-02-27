import { Template } from "tabler-icons-react"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"

import { useAlignHandles } from "@minus/graph-util"


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

    renderNode: () => {

        const alignHandle = useAlignHandles()
        alignHandle("template")()

        return <ListHandlesNodeContent
            handleName="data"
            arrowSide="in"
            emptyMessage="No variables"
        />
    },

    configuration: () => {
        return (
            <ControlStack>
                <ListHandlesControl
                    handleName="data"
                    controlTitle="Variable Names"
                    controlInfo="The names of the variables in the template. They will be filled in spots surrounded with curly braces. e.g. {FirstName}, {Email}"
                    addLabel="Add Variable"
                    inputPlaceholder="Variable Name"
                />
            </ControlStack>
        )
    }
}