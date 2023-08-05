import { Eye, Mail } from "tabler-icons-react"


export default {
    id: "gmail:MarkAsRead",
    name: "Mark As Read",
    description: "Marks an email as read.",
    icon: Eye,
    color: "red",

    tags: ["Gmail"],

    inputs: [
        {
            id: "messageId",
            description: "The ID of the message.",
            tooltip: "The ID of the message.",
            icon: Mail,
            allowedModes: ["handle", "config"],
            defaultMode: "handle",
        },
    ],
    outputs: [],

    requiredIntegrations: ["google"],
}