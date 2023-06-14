import { createMimeMessage } from "mimetext"
import { FieldValue } from "firebase-admin/firestore"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


/**
 * Watches a Gmail inbox.
 *
 * @export
 * @param {GmailAPI} gmail
 * @param {object} [options]
 * @param {object} [options.flow]
 */
export async function watchInbox(gmail, { flow, labelIds = ["INBOX"], labelFilterAction = "include", ...options } = {}) {

    // start watching
    const { data: { historyId } } = await gmail.users.watch({
        userId: "me",
        labelIds,
        labelFilterAction,
        topicName: `projects/${process.env.GCLOUD_PROJECT}/topics/gmail`,
        ...options,
    })

    // get email address for user
    const { data: { emailAddress } } = await gmail.users.getProfile({
        userId: "me",
    })

    // put email address & history ID in trigger data document
    await db.collection("triggerData").doc(flow.id).set({
        gmailEmailAddress: emailAddress,
        gmailHistoryId: historyId,
        gmailLabelIds: labelIds,
    }, { merge: true })
}


export async function unwatchInbox(gmail, { flow }) {
    // remove email address & history ID from trigger data document
    await db.collection("triggerData").doc(flow.id).update({
        gmailEmailAddress: FieldValue.delete(),
        gmailHistoryId: FieldValue.delete(),
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
 * @return {*} 
 */
export async function getMessage(gmail, id, {
    format = "clean",
} = {}) {
    const { data: message } = await gmail.users.messages.get({
        userId: "me",
        id,
    })

    if (format == "raw")
        return message

    if (format == "clean") {
        const fromHeader = getHeader(message, "From")
        const { name, emailAddress } = parseFromHeader(fromHeader)
        const plainText = decodeEmailBody(
            message.payload.body.data ??
            message.payload.parts?.find(part => part.mimeType == "text/plain")?.body.data ?? ""
        )

        return {
            senderName: name,
            senderEmailAddress: emailAddress,
            replyTo: getHeader(message, "Reply-To"),
            subject: getHeader(message, "Subject"),
            date: new Date(getHeader(message, "Date")),
            plainText,
            simpleText: cleanTextBody(plainText, { from: fromHeader }),
            html: decodeEmailBody(
                message.payload.parts?.find(part => part.mimeType == "text/html")?.body.data ?? ""
            ),
        }
    }
}


/**
 * Gets a header from a message.
 *
 * @export
 * @param {{ payload: {headers: Array<{name: string, value: string}>} }} messageData
 * @param {string} name
 */
export function getHeader(messageData, name) {
    return messageData.payload.headers.find(h => h.name == name)?.value
}


/**
 * Decodes the body of an email from base64.
 *
 * @export
 * @param {string} data Base64-encoded email body
 */
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
 * @param {object} [options] Additional information from the email
 * @param {string} [options.from] The "From" header of the email
 * @return {string} 
 */
export function cleanTextBody(textBody, {
    from,
} = {}) {
    let cleaned = textBody
        .replaceAll(/<http.+?>/g, "")   // remove links in <brackets>
        .replaceAll(/\n{3,}/g, "\n\n")  // shrink more than 3 line breaks
        .replaceAll(/&\w{3,5};/g, "")   // remove HTML entities
        .replaceAll(/@media.+?{.+}/gs, "") // remove media queries

    /**
     * If there's more than 5 URLs >80 characters in the email, remove them
     * all. These are probably product links with marketing tags.
     */
    const urlPattern = /https?:\/\/\S{80,}/g
    const urls = cleaned.match(urlPattern)?.length ?? 0
    if (urls > 5)
        cleaned = cleaned.replaceAll(urlPattern, "")

    /**
     * Remove reply text. It looks like this:
     * On Tue, Jun 13, 2023 at 12:29 PM Zach Sents <zachsents@gmail.com> wrote:
     * > This is reply text
     * > This is more reply text
     * > This is even more reply text
     */
    if (from) {
        cleaned = cleaned
            .replaceAll(new RegExp(`^On.+${from}.+`, "gm"), "")
            .replaceAll(/^>.*/gm, "")
    }

    // Trim whitespace
    cleaned = cleaned.trim()

    return cleaned
}