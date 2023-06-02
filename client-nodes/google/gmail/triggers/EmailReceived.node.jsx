import { Filter, Mailbox, Tags } from "tabler-icons-react"
import { EmailPayloadOutputs } from "../shared"
import { useInputValue } from "../../../hooks/nodes"
import { MultiSelect } from "@mantine/core"
import TextOrRegexControl from "../../../components/TextOrRegexControl"


const labelData = [
    { value: "INBOX", label: "Inbox" },
    { value: "SPAM", label: "Spam" },
    // { value: "TRASH", label: "Trash" },
    { value: "UNREAD", label: "Unread" },
    { value: "STARRED", label: "Starred" },
    { value: "IMPORTANT", label: "Important" },
    // { value: "SENT", label: "Sent" },
    // { value: "DRAFT", label: "Draft" },
    { value: "CATEGORY_PERSONAL", label: "Personal" },
    { value: "CATEGORY_SOCIAL", label: "Social" },
    { value: "CATEGORY_PROMOTIONS", label: "Promotions" },
    { value: "CATEGORY_UPDATES", label: "Updates" },
    { value: "CATEGORY_FORUMS", label: "Forums" },
]


export default {
    id: "gmail:EmailReceivedTrigger",
    name: "When an email is received",
    description: "Triggered when an email is received in Gmail.",
    icon: Mailbox,
    color: "red",

    tags: ["Trigger", "Gmail"],
    showMainTag: true,

    inputs: [
        {
            id: "labels",
            name: "Labels",
            description: "The labels to watch for new emails.",
            tooltip: "The labels to watch for new emails.",
            icon: Tags,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: ["INBOX"],
            renderConfiguration: ({ inputId, ...props }) => {
                const [value, setValue] = useInputValue(null, inputId)

                return (
                    <MultiSelect
                        withinPortal
                        data={labelData}
                        value={value ?? []}
                        onChange={setValue}
                        size="xs"
                    />
                )
            }
        },
        {
            id: "subjectFilter",
            description: "Only emails with a subject containing this text will trigger the node. Leave blank to allow all emails.",
            tooltip: "Only emails with a subject containing this text will trigger the node. Leave blank to allow all emails.",
            icon: Filter,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: "",
            renderConfiguration: TextOrRegexControl,
        },
    ],
    outputs: EmailPayloadOutputs(["senderEmailAddress", "subject", "simpleText"]),

    requiredIntegrations: ["google"],

    creatable: false,
    trigger: true,
    deletable: false,
}
