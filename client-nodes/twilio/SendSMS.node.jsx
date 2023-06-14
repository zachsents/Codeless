import PhoneNumberControl from "../components/PhoneNumberControl"
import { DeviceMobile, DeviceMobileMessage, Message, Users } from "tabler-icons-react"
import { LineDotted, Mail, TextCaption, User } from "tabler-icons-react"


export default {
    id: "twilio:SendSMS",
    name: "Send SMS",
    description: "Send an SMS text message to a phone number.",
    icon: DeviceMobileMessage,

    inputs: [
        {
            id: "to",
            description: "The phone number to send the SMS to.",
            tooltip: "The phone number to send the SMS to.",
            icon: User,
            allowedModes: ["config", "handle"],
            renderConfiguration: PhoneNumberControl,
        },
        {
            id: "body",
            name: "Message",
            description: "The body of the SMS message.",
            tooltip: "The body of the SMS message.",
            icon: Message,
            allowedModes: ["config", "handle"],
        },
    ],
    outputs: [],
}