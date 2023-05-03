import { google, logger, removeIntegrationAccount, storeIntegrationAccount, getIntegrationAccount, IntegrationAccountsCollection } from "@minus/server-sdk"
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

    const appId = request.query.state
    const oauthClient = await google.getGoogleOAuthClient(null)

    // create tokens from code
    const { tokens } = await oauthClient.getToken(request.query.code)

    // get email for identification
    const { email } = await oauthClient.getTokenInfo(tokens.access_token)
    if (!email)
        throw new Error("Something went wrong. Try authorizing again.")

    // make sure there's a refresh token -- if there's not, that means Minus has
    // been authorized previouly but we don't have the token. Revocation needed
    if (!tokens.refresh_token) {

        try {
            // check if we have one stored
            const { refreshToken } = await getIntegrationAccount({
                accountRef: IntegrationAccountsCollection.doc(`${google.GoogleIntegrationKey}:${email}`),
            })

            if (!refreshToken)
                throw new Error("No refresh token in integration account document")
        }
        catch (err) {
            // if not, the user will have to revoke manually
            console.error(err)
            return response.send("We didn't receive the credentials we expected. If Minus is saying Google isn't connected, you may need " +
                "to <a href='https://myaccount.google.com/u/0/permissions'>revoke access</a> and try again.")
        }
    }

    // store refresh token & scopes
    await storeIntegrationAccount(google.GoogleIntegrationKey, email, {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
    }, { appId })

    console.log(`Succesfully authorized app "${appId}" for Google`)

    // response with JS to close the popup window
    response.send("<script>window.close()</script>")
})


export const checkAuthorization = functions.https.onCall(async ({ appId, requiredScopes }) => {

    logger.setPrefix("Google")

    try {
        const oauthClient = await google.getGoogleOAuthClient(appId, { cache: false })

        // get access token and token info
        try {
            var { token: accessToken } = await oauthClient.getAccessToken()
            var { scopes, email } = await oauthClient.getTokenInfo(accessToken)
        }
        catch (err) {
            logger.debug("Refresh token is bad. Deleting integration account")

            // delete integration
            await removeIntegrationAccount({
                appId,
                integrationKey: google.GoogleIntegrationKey,
            })

            throw err
        }

        // store new access token -- don't really need to, but just b/c we have it
        await storeIntegrationAccount(google.GoogleIntegrationKey, email, {
            accessToken,
        })

        // check scopes
        const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope))

        if (missingScopes.length > 0)
            throw new Error(`Missing scopes: ${missingScopes.join(", ")}`)

        logger.log("Google app is authorized :)")

        return true
    }
    catch (err) {
        logger.error(err)
        logger.log("Google app is not authorized >:(")
        return false
    }
})