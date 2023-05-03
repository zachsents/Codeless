import { FileCode, FileText } from "tabler-icons-react"
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