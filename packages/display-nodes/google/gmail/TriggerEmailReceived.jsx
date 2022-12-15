import { httpsCallable } from "firebase/functions"
import { Mailbox } from "tabler-icons-react"


export default {
    name: "Email received",
    description: "Triggered when an email is received in Gmail.",
    icon: Mailbox,
    signalSources: [" "],
    valueSources: [
        "from",
        "subject",
        "date",
        "plainText",
        "html",
    ],

    onPublish: async ({ appId, flow, functions }) => {
        return await callGmailWatchFunction(functions, {
            appId,
            flow,
            stop: false,
        })
    },

    onUnpublish: async ({ appId, flow, functions }) => {
        return await callGmailWatchFunction(functions, {
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
            error: data.error,
        }
    }
    catch (err) {
        console.error(err)
        return { error: err.message }
    }
}