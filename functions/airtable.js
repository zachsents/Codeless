import { airtable } from "@minus/server-lib"
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https"
import fetch from "node-fetch"


/**
 * Authorize Airtable by redirecting to auth URL
 */
export const authorizeApp = onRequest(async (request, response) => {

    // Verify params -- must include app ID
    if (!request.query.app_id) {
        response.status(400).send({ error: "Must include an app ID" })
        throw new Error("Must include app ID")
    }

    // Respond with auth URL
    await airtable.authManager.respondWithAuthUrl(response, {
        appId: request.query.app_id,
    })
})


/**
 * Handle authorization callback from Airtable
 */
export const appAuthorizationRedirect = onRequest(
    airtable.authManager.handleAuthorizationCallback.bind(airtable.authManager)
)


/**
 * Check if Airtable is authorized
 */
export const checkAuthorization = onCall(
    ({ accountId }) => airtable.authManager.isAuthorized(accountId)
)


/**
 * Get table name given base ID and table ID
 */
export const getTableNameFromId = onCall(async ({ accountId, baseId, tableId }) => {

    // check params
    if (!accountId || !baseId || !tableId)
        throw new HttpsError("invalid-argument", "Must include integration account path and Airtable base ID and table ID")

    // airtable.js library doesn't provide access to the Metadata API
    const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
        headers: airtable.authManager.bearerAuthorizationHeader(
            await airtable.authManager.getAccessToken(accountId)
        )
    }).then(res => res.json())

    // check for errors
    if (res.error)
        throw new HttpsError("unknown", `${res.error.type}: ${res.error.message}`)

    return res.tables?.find(table => table.id == tableId)?.name
})
