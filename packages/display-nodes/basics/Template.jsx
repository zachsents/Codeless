import { Fragment } from "react"
import { ActionIcon, Button, Grid, Group, Space, Stack, Text, TextInput } from "@mantine/core"
import produce from "immer"
import { Template, Plus, X, ArrowRight } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components"


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

        alignHandles("template", null)

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