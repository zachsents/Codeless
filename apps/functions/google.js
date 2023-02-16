import { google } from "@minus/server-sdk"
import functions from "firebase-functions"
import { db } from "./init.js"


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
    const grantedScopes = (await oauthClient.getTokenInfo(tokens.access_token)).scopes

    // store refresh token & scopes
    const appId = request.query.state
    await db.doc(`apps/${appId}`).update({
        "integrations.Google.refreshToken": tokens.refresh_token,
        "integrations.Google.scopes": grantedScopes,
    })

    console.log(`Succesfully authorized app "${appId}"`)

    // response with JS to close the popup window
    response.send("<script>window.close()</script>")
})