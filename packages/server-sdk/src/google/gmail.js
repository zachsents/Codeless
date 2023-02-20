import { google } from "googleapis"
import { getGoogleOAuthClient } from "./google.js"


let gmailApi

export async function getGmailAPI(appId = global.info.appId, {
    cache = true,
} = {}) {
    
    if(cache && gmailApi)
        return gmailApi

    const auth = await getGoogleOAuthClient(appId)
    gmailApi = google.gmail({ version: "v1", auth })
    
    return gmailApi
}


export async function watchInbox(gmail, { flow }) {

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
