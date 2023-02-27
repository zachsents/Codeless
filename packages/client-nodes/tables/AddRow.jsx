import { TableImport } from "tabler-icons-react"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"

import { useAlignHandles } from "@minus/graph-util"


export default {
    id: "tables:AddRow",
    name: "Add Row",
    description: "Adds a row to a table.",
    icon: TableImport,
    color: "yellow",
    badge: "Tables",

    inputs: [
        "$table",
        {
            name: "data",
            list: true,
        }
    ],
    outputs: ["newRow"],

    defaultState: {
        dataLabels: [],
    },


    renderNode: () => {

        const alignHandle = useAlignHandles()
        alignHandle(["$table", "newRow"])()

        return (
            <ListHandlesNodeContent
                handleName="data"
                arrowSide="in"
                emptyMessage="No fields specified"
                unnamedMessage={i => `Field ${i + 1}`}
            />
        )
    },

    configuration: () => {

        return (
            <ControlStack>
                <ListHandlesControl
                    handleName="data"
                    controlTitle="Field Names"
                    controlInfo="The names of the fields to attach to the data."
                    addLabel="Add Field"
                    inputPlaceholder="Field Name"
                />
            </ControlStack>
        )
    }
}
