import { FirestoreStrategy, ServerGoogleManager } from "@minus/auth-lib"
import { FieldValue } from "firebase-admin/firestore"
import { defineSecret, defineString } from "firebase-functions/params"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


/**
 * Google Parameters
 * 
 * https://firebase.google.com/docs/functions/config-env?gen=1st
 */
const googleOAuthClientId = defineString("GOOGLE_OAUTH_CLIENT_ID", {
    description: "Google OAuth client ID",
})

const googleOAuthCallbackURL = defineString("GOOGLE_OAUTH_CALLBACK_URL", {
    description: "Google OAuth callback URL",
})

export const googleOAuthClientSecret = defineSecret("GOOGLE_OAUTH_CLIENT_SECRET", {
    description: "Google OAuth client secret",
})


// Set up OAuth manager
export const authManager = new ServerGoogleManager({
    clientId: googleOAuthClientId.value(),
    callbackUrl: googleOAuthCallbackURL.value(),
    scopes: [],

    get clientSecret() { return googleOAuthClientSecret.value() },
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
