import { httpsCallable } from "firebase/functions"
import { Mailbox } from "tabler-icons-react"


export default {
    id: "gmail:EmailReceivedTrigger",
    name: "Email Received",
    description: "Triggered when an email is received in Gmail.",
    icon: Mailbox,
    color: "red",
    badge: "Gmail",

    inputs: [],
    outputs: [
        "fromName", "fromEmail", "subject", "date", "plainText", {
            name: "html",
            label: "HTML",
        }],

    onPublish: ({ appId, flow, functions }) => {
        return callGmailWatchFunction(functions, {
            appId,
            flow,
            stop: false,
        })
    },

    onUnpublish: ({ appId, flow, functions }) => {
        return callGmailWatchFunction(functions, {
            appId,
            flow,
            stop: true,
        })
    },
}


async function callGmailWatchFunction(functions, payload) {
    try {
        const { data } = await httpsCallable(functions, "gmail-watchGmailInbox")(payload)
        return {
            error: data?.error,
        }
    }
    catch (err) {
        console.error(err)
        return { error: err.message }
    }
}