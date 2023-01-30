import { ActionIcon, Button, Grid, Group, Space, Stack, Text, TextInput } from "@mantine/core"
import produce from "immer"
import { Fragment } from "react"
import { Table, Plus, X, ArrowRight } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, ListHandlesControl, ListHandlesNodeContent, SkeletonWithHandle } from "../components"


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
    outputs: ["tableOut"],

    defaultState: {
        dataLabels: [],
    },


    renderNode: ({ state, alignHandles, listHandles }) => {

        alignHandles(["table", "tableOut"], null)

        return <ListHandlesNodeContent
            handleName="$data"
            listHandles={listHandles}
            alignHandles={alignHandles}
            state={state}
            arrowSide="in"
            emptyMessage="No columns specified"
            unnamedMessage={i => `Column ${i + 1}`}
        />
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
