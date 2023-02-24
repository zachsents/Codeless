import { BrandGmail } from "tabler-icons-react"


export default {
    id: "gmail:ReplyToEmail",
    name: "Reply To Email",
    description: "Replies to the email currently being handled. Only works for Email Received triggers.",
    icon: BrandGmail,
    color: "red",
    badge: "Gmail",

    inputs: ["body"],
    outputs: [],
}