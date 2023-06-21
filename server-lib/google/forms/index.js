import { FieldValue } from "firebase-admin/firestore"


const FORM_SUBMIT_TOPIC = `projects/${process.env.GCLOUD_PROJECT}/topics/forms-submit`


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


/**
 * Watches a Google Form.
 *
 * @export
 * @param {import("googleapis").forms_v1.Forms} formsApi
 * @param {object} [options]
 * @param {{ id: string }} [options.flow]
 * @param {string} [options.formId]
 */
export async function watchForm(formsApi, { flow, formId, account } = {}) {

    // Check for existing watches
    const { data: { watches } } = await formsApi.forms.watches.list({
        formId,
    })
    let watch = watches?.find(watch => watch.target.topic.topicName === FORM_SUBMIT_TOPIC)

    // TO DO: if there's an existing watch, renew it
    // If we don't do this, we could end up with an existing watch that's
    // about to expire.

    // If there's no watch, create one
    if (!watch) {
        const response = await formsApi.forms.watches.create({
            formId,
            requestBody: {
                watch: {
                    target: { topic: { topicName: FORM_SUBMIT_TOPIC } },
                    eventType: "RESPONSES",
                }
            }
        })
        watch = response.data
    }

    // Put watch ID in trigger data document
    await db.collection("triggerData").doc(flow.id).set({
        formsFormId: formId,
        formsWatchId: watch.id,
        formsAccount: account,
        formsHistoryId: new Date().toISOString(),
    }, { merge: true })
}


/**
 * Stops watching a Google Form.
 *
 * @export
 * @param {import("googleapis").forms_v1.Forms} formsApi
 * @param {object} [options]
 * @param {{ id: string }} [options.flow]
 * @param {string} [options.formId]
 */
export async function unwatchForm(formsApi, { flow }) {

    // Remove watch ID from trigger data document
    await db.collection("triggerData").doc(flow.id).update({
        formsFormId: FieldValue.delete(),
        formsWatchId: FieldValue.delete(),
        formsAccount: FieldValue.delete(),
        formsHistoryId: FieldValue.delete(),
    })
}
