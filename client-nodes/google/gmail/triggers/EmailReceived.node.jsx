import { Calendar, Code, FileText, LineDotted, Mailbox, TextSpellcheck, User } from "tabler-icons-react"


export default {
    id: "gmail:EmailReceivedTrigger",
    name: "When an email is received",
    description: "Triggered when an email is received in Gmail.",
    icon: Mailbox,
    color: "red",

    tags: ["Gmail", "Trigger"],

    inputs: [],
    outputs: [
        {
            id: "fromEmail",
            name: "Sender Email",
            description: "The email address of the sender.",
            tooltip: "The email address of the sender.",
            icon: User,
        },
        {
            id: "fromName",
            name: "Sender Name",
            description: "The name of the sender. Only available if the sender has a name associated with their email address.",
            tooltip: "The name of the sender. Only available if the sender has a name associated with their email address.",
            icon: User,
            defaultShowing: false,
        },
        {
            id: "subject",
            description: "The subject of the email.",
            tooltip: "The subject of the email.",
            icon: LineDotted,
        },
        {
            id: "date",
            name: "Date/Time",
            description: "The date and time the email was sent.",
            tooltip: "The date and time the email was sent.",
            icon: Calendar,
            defaultShowing: false,
        },
        {
            id: "simpleText",
            name: "Smart Text Content",
            description: "A simple text body of the email. This is the plain text body with all links removed. This is useful for processing the body of the email in other nodes.",
            tooltip: "A simple text body of the email. This is the plain text body with all links removed. This is useful for processing the body of the email in other nodes.",
            icon: TextSpellcheck,
        },
        {
            id: "plainText",
            description: "The plain text body of the email. This often contains links to images and other resources. For a plain text body without links, use the 'Smart Text Content' output.",
            tooltip: "The plain text body of the email. This often contains links to images and other resources. For a plain text body without links, use the 'Smart Text Content' output.",
            icon: FileText,
            defaultShowing: false,
        },
        {
            id: "html",
            name: "HTML",
            description: "The HTML body of the email. This contains the raw HTML code.",
            tooltip: "The HTML body of the email. This contains the raw HTML code.",
            icon: Code,
            defaultShowing: false,
        },
    ],

    requiredIntegrations: ["integration:Gmail"],

    creatable: false,
    trigger: true,
    deletable: false,
}