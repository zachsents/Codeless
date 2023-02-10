import { google } from "googleapis"


export default {
    id: "gmail:EmailReceivedTrigger",
    name: "Gmail Received Email",

    inputs: [],
    outputs: ["fromName", "fromEmail", "subject", "date", "plainText", "html"],

    onStart(setupPayload) {
        // "From" field sometimes looks like this: First Last <email@gmail.com>
        // let's parse it out first
        const { from, ...otherFields } = setupPayload
        const [, fromName, fromEmail] = from.match(/(.+?\s)<(.+?)>/) ?? [, , from]

        this.publish({ fromName, fromEmail, ...otherFields })
    },

    async onDeploy({ flow, googleOAuthClient }) {
        changeWatching(
            await getGmailApi(flow.app, googleOAuthClient),
            flow,
            true
        )
    },

    async onUndeploy({ flow, googleOAuthClient }) {
        changeWatching(
            await getGmailApi(flow.app, googleOAuthClient),
            flow,
            false
        )
    },
}


async function changeWatching(gmail, flow, watching = false) {

    // stop watching
    if (!watching) {
        // TO DO: make this check for other flows in the app before unwatching
        // const response = await gmail.users.stop({
        //     userId: "me",
        // })
        // return response.data
        return
    }

    // start watching
    const { data: { historyId } } = await gmail.users.watch({
        userId: "me",
        labelIds: ["INBOX"],
        labelFilterAction: "include",
        topicName: "projects/nameless-948a8/topics/gmail",
    })

    // get email address for user
    const { data: { emailAddress } } = await gmail.users.getProfile({
        userId: "me",
    })

    // put email address & history ID in flow document
    await flow.update({
        gmailTriggerEmailAddress: emailAddress,
        gmailTriggerHistoryId: historyId,
    })
}


function getGmailApi(app, oauthClient) {
    // grab stored refresh token
    const refreshToken = app.integrations?.Google?.refreshToken

    // throw error if there's no token
    if (!refreshToken)
        throw new Error("Gmail is not authorized")

    // authorize OAuth2 client with stored token
    oauthClient.setCredentials({
        refresh_token: refreshToken,
    })

    return google.gmail({ version: "v1", auth: oauthClient })
}