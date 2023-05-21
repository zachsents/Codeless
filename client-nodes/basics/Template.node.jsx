import { Text } from "@mantine/core"
import { AlphabetLatin, SquareX, Template } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"


export default {
    id: "basic:Template",
    name: "Fill Template",
    description: "Inserts values into a template.",
    icon: Template,

    tags: ["Text"],

    inputs: [
        {
            id: "template",
            description: "The template to fill. Values to be substituted are placed inside of curly braces.\ne.g. Hello {FirstName}, your email is {Email}.",
            tooltip: "The template to fill. Values to be substituted are placed inside of curly braces.\ne.g. Hello {FirstName}, your email is {Email}.",
            icon: Template,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: TextAreaControl,
        },
        {
            id: "data",
            name: "Substitution",
            description: "The values to substitute into the template.",
            tooltip: "The values to substitute into the template.",
            icon: SquareX,
            listMode: "named",
            defaultList: 1,
        },
    ],
    outputs: [
        {
            id: "result",
            name: "Filled Template",
            description: "The template with the values substituted.",
            tooltip: "The template with the values substituted.",
            icon: AlphabetLatin,
        }
    ],

    renderContent: () => {

        const [template] = useInputValue(null, "template")
        const [mode] = useInputMode(null, "template")

        return mode == InputMode.Config && (
            template ?
                <Text lineClamp={2} size="sm" color="dimmed" maw="14rem">{template}</Text> :
                <Text>No template provided</Text>
        )
    }
}