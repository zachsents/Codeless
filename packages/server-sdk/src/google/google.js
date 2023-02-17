import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { google } from "googleapis"


let oauthClient

export async function getGoogleOAuthClient(appId = global.info.appId, {
    cache = true,
} = {}) {

    if(cache && oauthClient)
        return oauthClient

    const detailsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "./google_secret.json")
    const { client_id, client_secret, redirect_uris } = JSON.parse(await fs.readFile(detailsPath, "utf-8"))

    oauthClient = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[process.env.FUNCTIONS_EMULATOR ? 0 : 1]
    )

    if(!appId)
        return oauthClient

    // grab stored refresh token
    const appSnapshot = await db.doc(`apps/${appId}`).get()
    const refreshToken = appSnapshot.data().integrations?.Google?.refreshToken

    if (!refreshToken)
        throw new Error("Google apps are not authorized")

    // authorize OAuth2 client with stored token
    oauthClient.setCredentials({
        refresh_token: refreshToken,
    })

    return oauthClient
}