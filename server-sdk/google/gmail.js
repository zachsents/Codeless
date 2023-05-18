import { google } from "googleapis"
import { getGoogleOAuthClient } from "./google.js"
import { createMimeMessage } from "mimetext"
import admin from "firebase-admin"


/**
 * @typedef {import("googleapis").gmail_v1.Gmail} GmailAPI
 */

let gmailApi

export const GmailIntegrationKey = "gmail"



/**
 * Creates an instance of the Gmail API.
 *
 * @export
 * @param {string} [appId=global.info.appId]
 * @param {object} [options]
 * @param {boolean} [options.cache=false]
 * @return {Promise<GmailAPI>} 
 */
export async function getGmailAPI(appId = global.info.appId, {
    cache = false,
} = {}) {

    if (cache && gmailApi)
        return gmailApi

    const auth = await getGoogleOAuthClient(appId)
    gmailApi = google.gmail({ version: "v1", auth })

    return gmailApi
}


/**
 * Watches a Gmail inbox.
 *
 * @export
 * @param {GmailAPI} gmail
 * @param {object} [options]
 * @param {object} [options.flow]
 */
export async function watchInbox(gmail, { flow }) {

    // start watching
    const { data: { historyId } } = await gmail.users.watch({
        userId: "me",
        labelIds: ["INBOX"],
        labelFilterAction: "include",
        topicName: `projects/${process.env.GCLOUD_PROJECT}/topics/gmail`,
    })

    // get email address for user
    const { data: { emailAddress } } = await gmail.users.getProfile({
        userId: "me",
    })

    // put email address & history ID in flow document
    await flow.update({
        "triggerData_gmailEmailAddress": emailAddress,
        "triggerData_gmailHistoryId": historyId,
    })
}


/**
 * Sends an email with the Gmail API from the authenticated user's address.
 *
 * @export
 * @param {GmailAPI} gmail
 * @param {object} params
 * @param {string | string[]} params.to
 * @param {string | string[]} [params.cc]
 * @param {string} params.subject
 * @param {string} [params.plainText]
 * @param {string} [params.html]
 * @param {string[][]} [params.headers]
 * @param {object} [requestBody]
 */
export async function sendEmail(gmail, { to, cc, subject, plainText, html, headers = [] } = {}, requestBody = {}) {

    // get sender email address
    const { data: { emailAddress: senderEmailAddress } } = await gmail.users.getProfile({
        userId: "me",
    })

    console.debug(`Sending email  to ${to} for ${senderEmailAddress}`)

    // set up message
    const msg = createMimeMessage()
    msg.setSender(senderEmailAddress)
    msg.setRecipient(to)
    msg.setSubject(subject)
    cc && msg.setCc(cc)

    // add content
    plainText && msg.setMessage("text/plain", plainText)
    html && msg.setMessage("text/html", html)

    // add headers
    msg.setHeader("X-Triggered-By", "Minus")
    headers.forEach(([name, value]) => msg.setHeader(name, value))

    // encode message
    const encodedMessage = Buffer.from(msg.asRaw()).toString("base64url")

    // console.debug(`Raw Content:\n${msg.asRaw()}`)

    // send email
    await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage,
            ...requestBody,
        },
    })
}


/**
 * Gets a message from the Gmail API given the message ID.
 *
 * @export
 * @param {GmailAPI} gmail
 * @param {string} id
 * @param {object} [options]
 * @param {"clean" | "raw"} [options.format="clean"]
 * @param {boolean} [options.asFirestoreDate=false]
 * @return {*} 
 */
export async function getMessage(gmail, id, {
    format = "clean",
    asFirestoreDate = false,
} = {}) {
    const { data: message } = await gmail.users.messages.get({
        userId: "me",
        id,
    })

    if (format == "raw")
        return message

    if (format == "clean") {
        const { name, emailAddress } = parseFromHeader(getHeader(message, "From"))
        const plainText = decodeEmailBody(
            message.payload.body.data ??
            message.payload.parts?.find(part => part.mimeType == "text/plain")?.body.data ?? ""
        )

        const date = new Date(getHeader(message, "Date"))

        return {
            senderName: name,
            senderEmailAddress: emailAddress,
            replyTo: getHeader(message, "Reply-To"),
            subject: getHeader(message, "Subject"),
            date: asFirestoreDate ? admin.firestore.Timestamp.fromDate(date) : date,
            plainText,
            simpleText: cleanTextBody(plainText),
            html: decodeEmailBody(
                message.payload.parts?.find(part => part.mimeType == "text/html")?.body.data ?? ""
            ),
        }
    }
}


export function getHeader(messageData, name) {
    return messageData.payload.headers.find(h => h.name == name)?.value
}


export function decodeEmailBody(data) {
    return Buffer.from(
        data,
        "base64"
    ).toString()
}


/**
 * Parses the "From" header of an email.
 * Sometimes the "From" header is in the format "Name <email@example.com>"
 *
 * @param {string} fromHeader
 * @return {{name: string, emailAddress: string}}} 
 */
export function parseFromHeader(fromHeader) {
    // eslint-disable-next-line no-sparse-arrays
    const [, name, emailAddress] = fromHeader.match(/(.+?\s)<(.+?)>/) ?? [, , fromHeader]
    return { name, emailAddress }
}


/**
 * Cleans up the text body of an email.
 *
 * @param {string} textBody
 * @return {string} 
 */
export function cleanTextBody(textBody) {
    return textBody
        .replaceAll(/<http.+?>/g, "")   // remove links
        .replaceAll(/\n{3,}/g, "\n\n")  // shrink more than 3 line breaks
}