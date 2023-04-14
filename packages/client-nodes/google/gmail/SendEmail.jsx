import { FileText, LineDotted, Mail, User, Users } from "tabler-icons-react"
import TextAreaControl from "../../components/TextAreaControl"


export default {
    id: "gmail:SendEmail",
    name: "Send Email",
    description: "Sends an email from the connected Gmail account.",
    icon: Mail,
    color: "red",

    tags: ["Gmail"],

    inputs: [
        {
            id: "to",
            description: "The email address of the recipient.",
            tooltip: "The email address of the recipient.",
            icon: User,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "cc",
            name: "CC",
            description: "The email address of the recipient to be CC'd.",
            tooltip: "The email address of the recipient to be CC'd.",
            icon: Users,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "subject",
            description: "The subject of the email to send.",
            tooltip: "The subject of the email to send.",
            icon: LineDotted,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "body",
            description: "The body of the email to send.",
            tooltip: "The body of the email to send.",
            icon: FileText,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
    ],
    outputs: [],

    requiredIntegrations: ["integration:Gmail"],
}