import { BrandGmail } from "tabler-icons-react"


export default {
    id: "gmail:SendEmail",
    name: "Send Email",
    description: "Sends an email from the connected Gmail account.",
    icon: BrandGmail,
    color: "red",
    badge: "Gmail",

    requiredIntegrations: ["integration:Gmail"],

    inputs: ["to", { name: "cc", label: "CC" }, "subject", "body"],
    outputs: [],
}