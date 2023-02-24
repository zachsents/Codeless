import { Mail } from "tabler-icons-react"

export default {
    id: "basic:SendEmail",
    name: "Send Email",
    description: "Sends an email from info@minuscode.app. To send an email from your account, try the Gmail Send Email node.",
    icon: Mail,

    inputs: ["to", "subject", "body"],
    outputs: [],
}