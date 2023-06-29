import { Calendar, Code, FileCode, FileDots, FileText, LineDotted, TextSpellcheck, User } from "tabler-icons-react"
import TextAreaControl from "../../components/TextAreaControl"


export const PlainTextBodyInput = {
    id: "bodyPlainText",
    name: "Body (Plain Text)",
    description: "The text to send in the reply.",
    tooltip: "The text to send in the reply.",
    icon: FileText,
    allowedModes: ["handle", "config"],
    renderConfiguration: TextAreaControl,
}

export const HTMLBodyInput = {
    id: "bodyHTML",
    name: "Body (HTML)",
    description: "The HTML body to reply with. Leave blank to only send plain text.",
    tooltip: "The HTML body to reply with. Leave blank to only send plain text.",
    icon: FileCode,
    allowedModes: ["handle", "config"],
    defaultMode: "config",
    renderConfiguration: TextAreaControl,
}

export const AttachmentInput = {
    id: "attachment",
    name: "Attachment",
    description: "The file to attach to the email.",
    tooltip: "The file to attach to the email.",
    icon: FileDots,
}

export const EmailPayloadOutputs = (defaults) => [
    {
        id: "senderEmailAddress",
        name: "Sender Email",
        description: "The email address of the sender.",
        tooltip: "The email address of the sender.",
        icon: User,
        defaultShowing: defaults?.includes("senderEmailAddress") ?? true,
    },
    {
        id: "senderName",
        name: "Sender Name",
        description: "The name of the sender. Only available if the sender has a name associated with their email address.",
        tooltip: "The name of the sender. Only available if the sender has a name associated with their email address.",
        icon: User,
        defaultShowing: defaults?.includes("senderName") ?? true,
    },
    {
        id: "date",
        name: "Date/Time",
        description: "The date and time the email was sent.",
        tooltip: "The date and time the email was sent.",
        icon: Calendar,
        defaultShowing: defaults?.includes("date") ?? true,
    },
    {
        id: "subject",
        description: "The subject of the email.",
        tooltip: "The subject of the email.",
        icon: LineDotted,
        defaultShowing: defaults?.includes("subject") ?? true,
    },
    {
        id: "simpleText",
        name: "Clean Text Content",
        description: "A simple text body of the email. This is the plain text body with all links removed. This is useful for processing the body of the email in other nodes.",
        tooltip: "A simple text body of the email. This is the plain text body with all links removed. This is useful for processing the body of the email in other nodes.",
        icon: TextSpellcheck,
        defaultShowing: defaults?.includes("simpleText") ?? true,
    },
    {
        id: "plainText",
        description: "The plain text body of the email. This often contains links to images and other resources. For a plain text body without links, use the 'Smart Text Content' output.",
        tooltip: "The plain text body of the email. This often contains links to images and other resources. For a plain text body without links, use the 'Smart Text Content' output.",
        icon: FileText,
        defaultShowing: defaults?.includes("plainText") ?? true,
    },
    {
        id: "html",
        name: "HTML",
        description: "The HTML body of the email. This contains the raw HTML code.",
        tooltip: "The HTML body of the email. This contains the raw HTML code.",
        icon: Code,
        defaultShowing: defaults?.includes("html") ?? true,
    },
]
