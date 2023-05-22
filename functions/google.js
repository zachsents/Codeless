import { google } from "@minus/server-lib"
import functions from "firebase-functions"


/**
 * Authorize Google by redirecting to auth URL
 */
export const authorizeApp = functions.https.onRequest(async (req, res) => {

    // Verify params -- must include app ID
    if (!req.query.app_id) {
        res.status(400).send({ error: "Must include an app ID" })
        throw new Error("Must include app ID")
    }

    // Add scopes
    const passedScopes = req.query.scopes?.split(",") || []
    google.authManager.options.scopes = [...new Set([
        ...google.authManager.options.scopes,
        ...passedScopes,
    ])]

    // Respond with auth URL
    await google.authManager.respondWithAuthUrl(res, {
        appId: req.query.app_id,
    })
})


/**
 * Handle authorization callback from Google
 */
export const appAuthorizationRedirect = functions.https.onRequest(
    google.authManager.handleAuthorizationCallback.bind(google.authManager)
)


/**
 * Check if a Google app is authorized
 */
export const checkAuthorization = functions.https.onCall(
    ({ accountId, requiredScopes }) => google.authManager.isAuthorized(accountId, { scopes: requiredScopes })
)