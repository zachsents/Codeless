import { addDoc, collection, deleteDoc, deleteField, doc, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { firestore } from "./firebase-init.js"
import { getDocsWithIds, getDocWithId } from "./firestore-util.js"
import { getPlanRef } from "./plans.js"
import { deleteFlow, getFlowsForApp } from "./flow-actions.js"


export const AppsCollectionPath = "apps"
export const AppsCollection = () => collection(firestore, AppsCollectionPath)


/**
 * Creates a reference to an app document.
 *
 * @export
 * @param {string} appId
 */
export function getAppRef(appId) {
    return appId && doc(AppsCollection(), appId)
}


/**
 * Gets app details.
 *
 * @export
 * @param {string} appId
 */
export function getAppDetails(appId) {
    return appId && getDocWithId(getAppRef(appId))
}


/**
 * Creates an app.
 *
 * @export
 * @param {object} options
 * @param {string} options.name
 * @param {string[]} options.ownerIds
 */
export function createApp({
    name,
    ownerIds = [],
    ...props
} = {}) {

    if (!name)
        throw new Error("Must include a name when creating an app.")

    if (ownerIds.length == 0)
        console.warn("App is being created without any owners.")

    return addDoc(AppsCollection(), {
        name,
        created: serverTimestamp(),
        owners: ownerIds,
        plan: getPlanRef("free"),
        color: "blue",
        ...props,
    })
}


/**
 * Renames an app.
 *
 * @export
 * @param {string} appId
 * @param {string} newName
 */
export function renameApp(appId, newName) {

    if (!newName)
        throw new Error("Must include a new name when renaming an app.")

    return updateApp(appId, { name: newName })
}


/**
 * Updates an app with a change object.
 *
 * @export
 * @param {string} appId
 * @param {object} [changes={}]
 */
export function updateApp(appId, changes = {}) {
    assertAppId(appId)

    return updateDoc(getAppRef(appId), changes)
}


/**
 * Deletes the field for an integration from an app.
 *
 * @export
 * @param {string} appId
 * @param {string} integrationName
 */
export function disconnectIntegration(appId, integrationName) {
    console.log(appId, integrationName)
    const updateObj = {
        [`integrations.${integrationName}`]: deleteField(),
    }
    console.log(updateObj)
    return updateApp(appId, updateObj)
}


/**
 * Deletes an app.
 *
 * @export
 * @param {string} appId
 */
export async function deleteApp(appId) {
    assertAppId(appId)
    const flows = await getFlowsForApp(appId)

    return Promise.all([
        ...flows.map(flow => deleteFlow(flow.id)),
        deleteDoc(getAppRef(appId))
    ])
}


/**
 * Creates a query for apps by user ID.
 *
 * @export
 * @param {string} userId
 */
export function createAppsForUserQuery(userId) {
    return userId && query(
        AppsCollection(),
        where("owners", "array-contains", userId)
    )
}


/**
 * Queries apps by user ID.
 *
 * @export
 * @param {string} userId
 */
export function getAppDetailsForUser(userId) {
    return userId && getDocsWithIds(
        createAppsForUserQuery(userId)
    )
}


/**
 * Throws an error if a falsy app ID is included.
 *
 * @param {string} appId
 */
function assertAppId(appId) {
    if (!appId)
        throw new Error("Must include an app ID.")
}