import { FirestoreStrategy, ServerAirtableManager } from "@minus/auth-lib"
import { loadProfile } from "../oauth-profiles/util.js"
import { FieldValue } from "firebase-admin/firestore"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


/** 
 * Load OAuth profile
 * @type {{ clientId: string, callbackUrl: string, scopes: string[] }} 
 */
const oauthProfile = await loadProfile("airtable", {
    differentLocal: true,
})


// Set up OAuth manager
export const authManager = new ServerAirtableManager({
    // client ID, callback URL, and scopes
    ...oauthProfile,
    clientSecret: process.env.AIRTABLE_OAUTH_CLIENT_SECRET,
})


// Set up Firestore Strategy
authManager.use(new FirestoreStrategy({
    database: db,
    stateCollection: "oauthStates",
    accountCollection: "integrationAccounts",
    accountKeyPrefix: "airtable:",
    getAccessTokenInsideTransaction: true,
    linkAccountId: {
        documentPath: ({ payload }) => `apps/${payload.appId}`,
        fieldPath: () => `integrations.airtable`,
        transform: accountId => FieldValue.arrayUnion(accountId),
    }
}))


// Convenience function to get Airtable API from node-code
export function getAirtableAPIFromNode(node) {
    return authManager.getAPI(node.getAccountId("integration:AirTable"))
}
