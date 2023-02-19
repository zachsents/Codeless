import { Table } from "tabler-icons-react"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent, SkeletonWithHandle } from "../components"


export default {
    id: "tables:AddRow",
    name: "Add Row",
    description: "Adds a row to a table.",
    icon: Table,
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


    renderNode: ({ state, alignHandles, listHandles }) => {

        alignHandles(["$table", "newRow"])

        return (
            <ListHandlesNodeContent
                handleName="data"
                listHandles={listHandles}
                alignHandles={alignHandles}
                state={state}
                arrowSide="in"
                emptyMessage="No fields specified"
                unnamedMessage={i => `Field ${i + 1}`}
            />
        )
    },

    configuration: ({ state, setState, listHandles }) => {

        return (
            <ControlStack>
                <ListHandlesControl
                    handleName="data"
                    listHandles={listHandles}
                    state={state}
                    setState={setState}
                    controlTitle="Field Names"
                    controlInfo="The names of the fields to attach to the data."
                    addLabel="Add Field"
                    inputPlaceholder="Field Name"
                />
            </ControlStack>
        )
    }
}
