import { LineDotted, Mail, Outbound, User, Users, UserSearch } from "tabler-icons-react"
import { EmailPayloadOutputs, HTMLBodyInput, PlainTextBodyInput } from "./shared"
import CheckboxControl from "../../components/CheckboxControl"


export default {
    id: "gmail:GetLatestCorrespondence",
    name: "Get Latest Correspondence",
    description: "Finds the most recent email exchanged with someone.",
    icon: UserSearch,
    color: "red",

    tags: ["Gmail"],

    inputs: [
        {
            id: "emailAddress",
            name: "Target Email",
            description: "The email address of the recipient we're targeting.",
            tooltip: "The email address of the recipient we're targeting.",
            icon: User,
            allowedModes: ["handle", "config"],
        },
        {
            id: "includeSelf",
            name: "Include Sent Emails",
            description: "Whether or not to include emails sent by the connected account.",
            tooltip: "Whether or not to include emails sent by the connected account.",
            icon: Outbound,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: CheckboxControl,
        },
    ],
    outputs: EmailPayloadOutputs,

    requiredIntegrations: ["integration:Gmail"],
}