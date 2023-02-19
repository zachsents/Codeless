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
        "table",
        {
            name: "$data",
            list: true,
        }
    ],
    outputs: [],

    defaultState: {
        dataLabels: [],
    },


    renderNode: ({ state, alignHandles, listHandles }) => {

        alignHandles("table")

        return (
            <ListHandlesNodeContent
                handleName="$data"
                listHandles={listHandles}
                alignHandles={alignHandles}
                state={state}
                arrowSide="in"
                emptyMessage="No columns specified"
                unnamedMessage={i => `Column ${i + 1}`}
            />
        )
    },

    configuration: ({ state, setState, listHandles }) => {

        return (
            <ControlStack>
                <ListHandlesControl
                    handleName="$data"
                    listHandles={listHandles}
                    state={state}
                    setState={setState}
                    controlTitle="Column Names"
                    controlInfo="The names of the columns to attach to the data. Leave blank if you just want them data added in order."
                    addLabel="Add Column"
                    inputPlaceholder="Column Name"
                />
            </ControlStack>
        )
    }
}
