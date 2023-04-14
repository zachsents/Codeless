import { FileText, MailOpened } from "tabler-icons-react"
import TextAreaControl from "../../components/TextAreaControl"


export default {
    id: "gmail:ReplyToEmail",
    name: "Reply To Email",
    description: "Replies to the email currently being handled. Only works for Email Received triggers.",
    icon: MailOpened,
    color: "red",

    tags: ["Gmail"],

    inputs: [
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