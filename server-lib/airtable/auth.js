import { FirestoreStrategy, ServerAirtableManager } from "@minus/auth-lib"
import { FieldValue } from "firebase-admin/firestore"
import { defineSecret, defineString } from "firebase-functions/params"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


/**
 * Airtable Parameters
 * 
 * https://firebase.google.com/docs/functions/config-env?gen=1st
 */
const airtableOAuthClientId = defineString("AIRTABLE_OAUTH_CLIENT_ID", {
    description: "Airtable OAuth client ID",
})

const airtableOAuthCallbackURL = defineString("AIRTABLE_OAUTH_CALLBACK_URL", {
    description: "Airtable OAuth callback URL",
})

const airtableOAuthScopes = defineString("AIRTABLE_OAUTH_SCOPES", {
    description: "Airtable OAuth scopes",
    default: "data.records:read,data.records:write,webhook:manage,schema.bases:read",
})

export const airtableOAuthClientSecret = defineSecret("AIRTABLE_OAUTH_CLIENT_SECRET", {
    description: "Airtable OAuth client secret",
})


// Set up OAuth manager
export const authManager = new ServerAirtableManager({
    clientId: airtableOAuthClientId.value(),
    callbackUrl: airtableOAuthCallbackURL.value(),
    scopes: airtableOAuthScopes.value(),

    get clientSecret() { return airtableOAuthClientSecret.value() },
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
    return authManager.getAPI(node.getAccountId("airtable"))
}
