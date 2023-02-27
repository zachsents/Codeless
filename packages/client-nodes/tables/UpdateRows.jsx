import { TableShortcut } from "tabler-icons-react"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"

import { useAlignHandles } from "@minus/graph-util"


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

    renderNode: () => {

        const alignHandle = useAlignHandles()
        alignHandle(["rows", "updatedRows"])()

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
