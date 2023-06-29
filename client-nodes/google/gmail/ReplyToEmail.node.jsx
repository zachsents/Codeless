import { MailOpened } from "tabler-icons-react"
import { AttachmentInput, HTMLBodyInput, PlainTextBodyInput } from "./shared"


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
        AttachmentInput,
    ],
    outputs: [],

    requiredIntegrations: ["google"],
}