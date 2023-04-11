import { LineDotted, Mail, TextCaption, User } from "tabler-icons-react"

export default {
    id: "basic:SendEmail",
    name: "Send Email",
    description: "Sends an email from info@minuscode.app. To send an email from your account, try the Gmail Send Email node.",
    icon: Mail,

    inputs: [
        {
            id: "to",
            description: "The email address to send the email to.",
            tooltip: "The email address to send the email to.",
            icon: User,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
        },
        {
            id: "subject",
            description: "The subject of the email.",
            tooltip: "The subject of the email.",
            icon: LineDotted,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
        },
        {
            id: "body",
            description: "The body of the email.",
            tooltip: "The body of the email.",
            icon: TextCaption,
            allowedModes: ["config", "handle"],
        },
    ],
    outputs: [],
}