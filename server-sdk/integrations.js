import { FieldValue } from "firebase-admin/firestore"
import { logger } from "./logger.js"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db

export const IntegrationAccountsCollection = db.collection("integrationAccounts")
const AppIntegrationPath = (...parts) => ["integrations", ...parts].join(".")


/**
 * Stores authorization data for an integration account.
 *
 * @export
 * @param {string} integrationKey The descriptor of the integration. e.g. "google", "airtable"
 * @param {string} integrationUserId The ID of the user within that integration. This is different from the Minus user ID.
 * @param {object} [data={}]
 * @param {object} [options]
 * @param {string} [options.appId] A Minus app ID. If provided, a ref to the integration account document will also be stored in the app.
 * @param {import("firebase-admin").firestore.Transaction} [options.transaction] If provided, this will be used for reading and writing
 */
export async function storeIntegrationAccount(integrationKey, integrationUserId, data = {}, {
    appId,
    transaction,
} = {}) {

    logger.setPrefix("Integrations")

    if (!integrationKey)
        throw new Error("Must provide integration key")

    if (!integrationUserId)
        throw new Error("Must include user ID")

    // set the data in the integrationAuth collection -- this will look a little different
    // for every integration
    const integrationDocRef = IntegrationAccountsCollection.doc(`${integrationKey}:${integrationUserId}`)

    // write document -- either in transaction or regularly
    await (
        transaction?.set(integrationDocRef, data, { merge: true }) ??
        integrationDocRef.set(data, { merge: true })
    )

    logger.debug(`Created new account for "${integrationKey}"`)

    // if an app is provided, we'll store the integration doc ID there, too
    if (appId) {
        const appDocRef = db.collection("apps").doc(appId)
        const updateData = {
            [AppIntegrationPath(integrationKey)]: integrationDocRef,
        }

        await (
            transaction?.update(appDocRef, updateData) ??
            appDocRef.update(updateData)
        )

        logger.debug(`Stored account for app "${appId}"`)
    }

    logger.done()
    return integrationDocRef
}


/**
 * Gets the data for an integration account.
 *
 * @export
 * @param {object} options
 * @param {string} [options.appId] A Minus app ID. If included, integrationKey must also be provided.
 * @param {object} [options.app] A Minus app object. If included, integrationKey must also be provided.
 * @param {string} [options.integrationKey] The descriptor of the integration. e.g. "google", "airtable". Must be
 * included if using app or appId
 * @param {import("firebase-admin").firestore.DocumentReference} [options.accountRef]
 * @param {import("firebase-admin").firestore.Transaction} [options.transaction] If provided, this will be used for reading and writing
 */
export async function getIntegrationAccount({
    appId, app, integrationKey,
    accountRef,
    transaction,
} = {}) {

    // get account ref & do some error checks
    ({ accountRef } = await precursor({ appId, app, integrationKey, accountRef, transaction }))

    // get account
    const accountDoc = await (transaction?.get(accountRef) ?? accountRef.get())

    if (!accountDoc.exists)
        throw new Error("Account doesn't exit")

    return {
        id: accountDoc.id.split(":")[1],
        ...accountDoc.data(),
    }
}


/**
 *
 *
 * @export
 * @param {object} options
 * @param {string} [options.appId] A Minus app ID. If included, integrationKey must also be provided.
 * @param {object} [options.app] A Minus app object. If included, integrationKey must also be provided.
 * @param {string} [options.integrationKey] The descriptor of the integration. e.g. "google", "airtable". Must be
 * included if using app or appId
 * @param {import("firebase-admin").firestore.DocumentReference} [options.accountRef]
 * @param {import("firebase-admin").firestore.Transaction} [options.transaction] If provided, this will be used for reading and writing
 */
export async function removeIntegrationAccount({
    appId, app, integrationKey,
    accountRef,
    transaction,
} = {}) {

    // get account ref & do some error checks
    ({ accountRef, app } = await precursor({ appId, app, integrationKey, accountRef, transaction }))

    // delete account doc
    await (
        transaction?.delete(accountRef) ??
        accountRef.delete()
    )

    // remove from app doc
    const appDocRef = db.collection("apps").doc(app.id)
    const updateData = {
        [AppIntegrationPath(integrationKey)]: FieldValue.delete()
    }
    await (
        transaction?.update(appDocRef, updateData) ??
        appDocRef.update(updateData)
    )
}


/**
 * @return {Promise<import("firebase-admin").firestore.DocumentReference>} 
 */
async function precursor({ appId, app, integrationKey, accountRef, transaction }) {

    if ((app || appId) && !integrationKey)
        throw new Error("Must include integration key if using app or app ID")

    // get account ref if using if using app or app ID
    if (appId) {
        const appDocRef = db.collection("apps").doc(appId)
        const appDoc = await (transaction?.get(appDocRef) ?? appDocRef.get())
        app = { id: appDocRef.id, ...appDoc.data() }
    }
    if (app)
        accountRef = app.integrations?.[integrationKey]

    if (!accountRef)
        throw new Error("No account provided or found in app")

    return { app, accountRef }
}