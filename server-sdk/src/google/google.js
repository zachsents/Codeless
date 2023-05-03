import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { google } from "googleapis"
import { getIntegrationAccount } from "../integrations.js"



let oauthClient

export const GoogleIntegrationKey = "google"


/**
 * @return {Promise<google.auth.OAuth2>} 
 */
export async function getGoogleOAuthClient(appId = global.info.appId, {
    cache = false,
} = {}) {

    if (cache && oauthClient)
        return oauthClient

    // set up OAuth2 client
    const detailsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "./google_oauth.json")
    const { client_id, redirect_uris } = JSON.parse(await fs.readFile(detailsPath, "utf-8"))

    oauthClient = new google.auth.OAuth2(
        client_id,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uris[process.env.FUNCTIONS_EMULATOR ? 0 : 1]
    )

    if (!appId)
        return oauthClient

    // grab stored refresh token
    const { refreshToken } = await getIntegrationAccount({
        appId,
        integrationKey: GoogleIntegrationKey,
    })

    if (!refreshToken)
        throw new Error("Google apps are not authorized", { cause: "missing refresh token" })

    // authorize OAuth2 client with stored token
    oauthClient.setCredentials({
        refresh_token: refreshToken,
    })

    return oauthClient
}