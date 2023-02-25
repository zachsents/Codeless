import { TableShortcut } from "tabler-icons-react"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"


export default {
    id: "tables:UpdateRows",
    name: "Update Rows",
    description: "Updates rows in a table.",
    icon: TableShortcut,
    color: "yellow",
    badge: "Tables",

    inputs: [
        "rows",
        {
            name: "data",
            list: true,
        }
    ],
    outputs: ["updatedRows"],


    defaultState: {
        dataLabels: [],
    },

    renderNode: ({ state, alignHandles, listHandles }) => {

        alignHandles(["rows", "updatedRows"])

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
