import { Mail } from "tabler-icons-react"

export default {
    id: "basic:SendEmail",
    name: "Send Email",
    description: "Sends an email.",
    icon: Mail,

    inputs: ["to", "$subject", "$body"],
    outputs: [],
}