import { google } from "@minus/server-lib"
import { onCall, onRequest } from "firebase-functions/v2/https"


/**
 * Authorize Google by redirecting to auth URL
 */
export const authorizeApp = onRequest(async (req, res) => {

    // Verify params -- must include app ID
    if (!req.query.app_id) {
        res.status(400).send({ error: "Must include an app ID" })
        throw new Error("Must include app ID")
    }

    // Respond with auth URL
    await google.authManager.respondWithAuthUrl(res, {
        appId: req.query.app_id,
        additionalScopes: req.query.scopes?.split(",") || [],
    })
})


/**
 * Handle authorization callback from Google
 */
export const appAuthorizationRedirect = onRequest(
    google.authManager.handleAuthorizationCallback.bind(google.authManager)
)


/**
 * Check if a Google app is authorized
 */
export const checkAuthorization = onCall(
    ({ accountId, requiredScopes }) => google.authManager.isAuthorized(accountId, { scopes: requiredScopes })
)