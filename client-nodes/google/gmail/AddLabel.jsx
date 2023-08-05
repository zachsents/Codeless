import { Mail, Tags, Users } from "tabler-icons-react"


export default {
    id: "gmail:AddLabel",
    name: "Add Label",
    description: "Adds a label to an email.",
    icon: Tags,
    color: "red",

    tags: ["Gmail"],

    inputs: [
        {
            id: "messageId",
            description: "The ID of the message to add labels to.",
            tooltip: "The ID of the message to add labels to.",
            icon: Mail,
            allowedModes: ["handle", "config"],
            defaultMode: "handle",
        },
        {
            id: "label",
            name: "Label",
            description: "The label to add to the email.",
            tooltip: "The label to add to the email.",
            icon: Users,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
    ],
    outputs: [],

    requiredIntegrations: ["google"],
}