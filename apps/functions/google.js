import { google, storeIntegrationAccount } from "@minus/server-sdk"
import functions from "firebase-functions"


export const authorizeApp = functions.https.onRequest(async (request, response) => {

    const oauthClient = await google.getGoogleOAuthClient(null)

    const url = oauthClient.generateAuthUrl({
        access_type: "offline",
        scope: request.query.scopes.split(","),
        state: request.query.app_id,
        include_granted_scopes: true,
    })

    response.redirect(url)
})


export const appAuthorizationRedirect = functions.https.onRequest(async (request, response) => {

    const oauthClient = await google.getGoogleOAuthClient(null)

    // create tokens from code
    const { tokens } = await oauthClient.getToken(request.query.code)

    // check granted scopes
    const { scopes, email } = await oauthClient.getTokenInfo(tokens.access_token)

    // store refresh token & scopes
    const appId = request.query.state
    await storeIntegrationAccount(google.GoogleIntegrationKey, email, {
        refreshToken: tokens.refresh_token,
        scopes,
    }, { appId })

    console.log(`Succesfully authorized app "${appId}" for Google`)

    // response with JS to close the popup window
    response.send("<script>window.close()</script>")
})


export const checkAuthorization = functions.https.onCall(async ({ appId, requiredScopes }) => {

    try {
        const oauthClient = await google.getGoogleOAuthClient(appId, { cache: false })

        const { token: accessToken } = await oauthClient.getAccessToken()
        const { scopes, email } = await oauthClient.getTokenInfo(accessToken)

        // update scopes
        await storeIntegrationAccount(google.GoogleIntegrationKey, email, {
            scopes,
        })

        // check scopes
        const authorized = requiredScopes.every(scope => scopes.includes(scope))

        if (!authorized)
            throw new Error(`Missing 1 or more of these scopes: ${requiredScopes.join(", ")}`)

        console.log("Google app is authorized :)")

        return true
    }
    catch (err) {
        console.error(err)
        console.log("Google app is not authorized >:(")
        return false
    }
})