import { FirestoreStrategy, ServerGoogleManager } from "@minus/auth-lib"
import { loadProfile } from "../oauth-profiles/util.js"
import { FieldValue } from "firebase-admin/firestore"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


/** 
 * Load OAuth profile
 * @type {{ clientId: string, callbackUrl: string[] }} 
 */
const oauthProfile = await loadProfile("google")


// Set up OAuth manager
export const authManager = new ServerGoogleManager({
    // client ID, callback URL, and scopes
    ...oauthProfile,
    clientSecret: process.env.AIRTABLE_OAUTH_CLIENT_SECRET,
    scopes: [],
})


// Set up Firestore Strategy
authManager.use(new FirestoreStrategy({
    database: db,
    stateCollection: "oauthStates",
    accountCollection: "integrationAccounts",
    accountKeyPrefix: "google:",
    linkAccountId: {
        documentPath: ({ payload }) => `apps/${payload.appId}`,
        fieldPath: () => `integrations.google`,
        transform: accountId => FieldValue.arrayUnion(accountId),
    }
}))


// Convenience function to get a Google API from node-code
export function getGoogleAPIFromNode(node, api, version) {
    return authManager.getAPI(node.getAccountId("google"), {
        api,
        version,
    })
}