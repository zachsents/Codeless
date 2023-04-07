import { collection, doc, updateDoc } from "firebase/firestore"
import { firestore } from "./firebase-init.js"


export const UsersCollectionPath = "users"
export const UsersCollection = () => collection(firestore, UsersCollectionPath)


/**
 * Creates a reference to a user document.
 *
 * @export
 * @param {string} userId
 */
export function getUserRef(userId) {
    return userId && doc(UsersCollection(), userId)
}


/**
 * Updates a user with a change object.
 *
 * @export
 * @param {string} userId
 * @param {object} [changes={}]
 */
export async function updateUser(userId, changes = {}) {
    assertUserId(userId)
    return updateDoc(getUserRef(userId), changes)
}


/**
 * Throws an error if a falsy user ID is included.
 *
 * @param {string} userId
 */
function assertUserId(userId) {
    if (!userId)
        throw new Error("Must include a user ID.")
}