import { SiOpenai } from "react-icons/si"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"


export default {
    id: "openai:Parse",
    name: "Extract",
    description: "Parse fields out of text with GPT3.",
    icon: SiOpenai,
    color: "dark",
    badge: "Open AI",

    tags: ["ChatGPT"],

    inputs: ["text"],
    outputs: [
        {
            name: "data",
            list: true,
        }
    ],

    defaultState: {
        dataLabels: [],
    },

    renderNode: ({ state, alignHandles, listHandles }) => {

        alignHandles("text")

        return <ListHandlesNodeContent
            handleName="data"
            listHandles={listHandles}
            alignHandles={alignHandles}
            state={state}
            arrowSide="out"
            emptyMessage="No outputs specified"
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
                    controlTitle="Outputs"
                    controlInfo="The outputs you'd like to pull from the text."
                    addLabel="Add Output"
                    inputPlaceholder="Output Name"
                />
            </ControlStack>
        )
    }
}