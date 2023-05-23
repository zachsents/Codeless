import { Mailbox } from "tabler-icons-react"
import { EmailPayloadOutputs } from "../shared"


export default {
    id: "gmail:EmailReceivedTrigger",
    name: "When an email is received",
    description: "Triggered when an email is received in Gmail.",
    icon: Mailbox,
    color: "red",

    tags: ["Gmail", "Trigger"],

    inputs: [],
    outputs: EmailPayloadOutputs(["senderEmailAddress", "subject", "simpleText"]),

    requiredIntegrations: ["google"],

    creatable: false,
    trigger: true,
    deletable: false,
}