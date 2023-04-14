import { Text } from "@mantine/core"
import { SiOpenai } from "react-icons/si"
import { Control, ControlLabel, ControlStack, RequiresConfiguration } from "../components"
import MultiInput from "../components/MultiInput"


export default {
    id: "openai:Classify",
    name: "Classify with GPT",
    description: "Classifies text as one of the specified categories.",
    icon: SiOpenai,
    color: "dark",
    tags: ["Open AI"],

    inputs: ["text"],
    outputs: ["classification"],

    defaultState: {
        categories: [],
    },

    renderNode: ({ state }) => {
        return (
            <RequiresConfiguration dependencies={[!!state.categories?.length]}>
                <Text align="center"><b>{state.categories?.length}</b> {state.categories?.length == 1 ? "category" : "categories"}</Text>
            </RequiresConfiguration>
        )
    },

    configuration: ({ state, setState }) => {

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The categories, one of which the text will be classified as.">
                        Categories
                    </ControlLabel>
                    <MultiInput
                        items={state.categories ?? []}
                        onChange={categories => setState({ categories })}
                        inputProps={{
                            placeholder: "Category",
                        }}
                        buttonChildren="Add Category"
                    />
                </Control>
            </ControlStack>
        )
    },
}