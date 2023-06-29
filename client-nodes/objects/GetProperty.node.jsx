import ErrorText from "../components/ErrorText"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"
import { Package, Sitemap, SquareX, Target } from "tabler-icons-react"


export default {
    id: "objects:GetProperty",
    name: "Get Property",
    description: "Gets a property from a data object.",
    icon: Sitemap,

    tags: ["Data", "Advanced"],

    inputs: [
        {
            id: "object",
            type: "data object",
            description: "The data object.",
            tooltip: "The data object.",
            icon: Package,
        },
        {
            id: "property",
            description: "The name of the property to get.",
            tooltip: "The name of the property to get.",
            icon: SquareX,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
    ],
    outputs: [
        {
            id: "value",
            description: "The property value.",
            tooltip: "The property value.",
            icon: Target,
        },
    ],

    renderName: () => {
        const [property] = useInputValue(null, "property")
        const [propertyMode] = useInputMode(null, "property")

        return propertyMode == InputMode.Config && property ? `Get Property "${property}"` : "Get Property"
    },

    renderContent: () => {
        const [property] = useInputValue(null, "property")
        const [propertyMode] = useInputMode(null, "property")

        if (propertyMode == InputMode.Config && !property)
            return <ErrorText>No property provided</ErrorText>
    }
}