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
}