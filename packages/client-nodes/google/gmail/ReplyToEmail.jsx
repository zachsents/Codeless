import { MailOpened } from "tabler-icons-react"
import { HTMLBodyInput, PlainTextBodyInput } from "./shared"


export default {
    id: "gmail:ReplyToEmail",
    name: "Reply To Email",
    description: "Replies to the email currently being handled. Only works for Email Received triggers.",
    icon: MailOpened,
    color: "red",

    tags: ["Gmail"],

    inputs: [
        PlainTextBodyInput,
        HTMLBodyInput,
    ],
    outputs: [],

    requiredIntegrations: ["integration:Gmail"],
}