import functions from "firebase-functions"
import { oauthClient, db } from "./init.js"
import { google } from "googleapis"
import { ExecutionMethod, run } from "./index.js"


export const watchGmailInbox = functions.https.onCall(async ({ appId, flow, stop = false }) => {

    // get Gmail API
    const gmail = await getGmailApi(appId)

    // stop watching
    if (stop) {
        // TO DO: make this check for other flows in the app before unwatching
        // const response = await gmail.users.stop({
        //     userId: "me",
        // })
        // return response.data
        return
    }

    // start watching
    const response = await gmail.users.watch({
        userId: "me",
        labelIds: ["INBOX"],
        labelFilterAction: "include",
        topicName: "projects/nameless-948a8/topics/gmail",
    })

    // get email address for user
    const { data: { emailAddress } } = await gmail.users.getProfile({
        userId: "me",
    })

    // put trigger email address in flow document
    await db.doc(`apps/${appId}/flows/${flow.id}`).update({
        gmailTriggerEmailAddress: emailAddress
    })

    return response.data
})


export const runFromGmailEvent = functions.pubsub.topic("gmail").onPublish(async (message, context) => {

    // parse out pubsub message data
    const { emailAddress, historyId } = message.data &&
        JSON.parse(
            Buffer.from(message.data, 'base64').toString()
        )

    // export const testGmail = functions.https.onRequest(async (req, res) => {

    //     const emailAddress = "zachsents@gmail.com"
    //     const historyId = "9202665"
    //     res.send({})

    console.debug(`Received Gmail Event: ${emailAddress}, ${historyId}`)

    // query for flows involving this email address
    const querySnapshot = await db.collectionGroup("flows")
        .where("gmailTriggerEmailAddress", "==", emailAddress)
        .where("deployed", "==", true)
        .get()

    // group flows by app
    const appMap = querySnapshot.docs.reduce((accum, doc) => {
        const appId = doc.ref.parent.parent.id
        if (accum[appId])
            accum[appId].push(doc.id)
        else
            accum[appId] = [doc.id]
        return accum
    }, {})

    // loop through each one
    for (let appId of Object.keys(appMap)) {
        console.debug("Current app:", appId)

        // get Gmail API
        const gmail = await getGmailApi(appId)

        // fetch history
        const { data: { history } } = await gmail.users.history.list({
            userId: "me",
            startHistoryId: historyId,
            // historyTypes: ["messageAdded"],
        })

        // map to a list of unique message IDs
        const messageIds = [...new Set(
            history?.map(item => item.messages?.map(message => message.id) ?? []).flat() ?? []
        )]

        console.debug(`Found ${messageIds.length} message IDs in history.`)

        // fetch messages
        const messages = (await Promise.all(
            messageIds.map(async id => {
                try {
                    const { data } = await gmail.users.messages.get({
                        userId: "me",
                        id,
                    })

                    console.debug(`Got message: ${id}`)

                    // pull out the data we want
                    return {
                        id: data.id,
                        from: getHeader("From", data.payload),
                        replyTo: getHeader("Reply-To", data.payload),
                        subject: getHeader("Subject", data.payload),
                        date: getHeader("Date", data.payload),
                        plainText: decodeEmailBody(
                            data.payload.body.data ??
                            data.payload.parts?.find(part => part.mimeType == "text/plain")?.body.data ?? ""
                        ),
                        html: decodeEmailBody(
                            data.payload.parts?.find(part => part.mimeType == "text/html")?.body.data ?? ""
                        ),
                        snippet: data.snippet,
                    }
                }
                catch (err) {
                    console.debug(`Encountered an error fetching message ${id}:`)
                    console.debug(err.message + "\n")
                }
            })
        ))
            .filter(message => !!message)

        console.debug(`Was able to retrieve ${messages.length} messages.`)

        // run flows 
        await Promise.all(
            messages.map(message => appMap[appId].map(flowId => run({
                appId,
                flowId,
                payload: message,
                logOptions: {
                    executionMethod: ExecutionMethod.PubSub,
                }
            })))
                .flat()
        )
    }
})


export const refreshWatch = functions.pubsub.schedule("0 11 * * *").onRun(async (context) => {
// export const refreshWatch = functions.https.onRequest(async (req, res) => {
//     res.send({})

    // get flows with Gmail trigger
    const querySnapshot = await db.collectionGroup("flows")
        .where("trigger", "==", "trigger:gmail:EmailReceived")
        // .where("deployed", "==", true)
        .get()

    // map to unique app IDs
    const appIds = [...new Set(
        querySnapshot.docs.map(doc => doc.ref.parent.parent.id)
    )]

    console.log(`Refreshing Gmail watch for ${appIds.length} apps.`)

    // loop through app IDs
    for (let appId of appIds) {
        // get Gmail API
        const gmail = await getGmailApi(appId)

        // refresh watch
        await gmail.users.watch({
            userId: "me",
            labelIds: ["INBOX"],
            labelFilterAction: "include",
            topicName: "projects/nameless-948a8/topics/gmail",
        })
    }
})


async function getGmailApi(appId) {
    // grab stored refresh token
    const appSnapshot = await db.doc(`apps/${appId}`).get()
    const refreshToken = appSnapshot.data().integrations?.Google?.refreshToken

    // throw error if there's no token
    if (!refreshToken)
        return { error: "Gmail is not authorized." }

    // authorize OAuth2 client with stored token
    oauthClient.setCredentials({
        refresh_token: refreshToken,
    })

    return google.gmail({ version: "v1", auth: oauthClient })
}


function getHeader(name, payload) {
    return payload.headers.find(h => h.name == name)?.value
}

function decodeEmailBody(data) {
    return Buffer.from(
        data,
        "base64"
    ).toString()
}