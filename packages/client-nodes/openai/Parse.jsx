import { SiOpenai } from "react-icons/si"
import { ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"

import { useAlignHandles } from "@minus/graph-util"


export default {
    id: "openai:Parse",
    name: "Parse with GPT",
    description: "Parse fields out of text with GPT3.",
    icon: SiOpenai,
    color: "dark",
    badge: "Open AI",

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

    renderNode: () => {

        const alignHandle = useAlignHandles()
        alignHandle("text")()

        return <ListHandlesNodeContent
            handleName="data"
            arrowSide="out"
            emptyMessage="No outputs specified"
        />
    },

    configuration: () => {
        return (
            <ControlStack>
                <ListHandlesControl
                    handleName="data"
                    controlTitle="Outputs"
                    controlInfo="The outputs you'd like to pull from the text."
                    addLabel="Add Output"
                    inputPlaceholder="Output Name"
                />
            </ControlStack>
        )
    }
}