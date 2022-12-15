import admin from "firebase-admin"
import { google } from "googleapis"
import fs from "fs/promises"


admin.initializeApp()
global.admin = admin
export const db = admin.firestore()

// create & globalize OAuth2 client
export const oauthClient = await getOAuth2Client()
global.oauthClient = oauthClient


async function getOAuth2Client() {
    const { web: { client_id, client_secret, redirect_uris } } = JSON.parse(await fs.readFile("./oauth_client_secret.json", "utf-8"))

    return new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[process.env.FUNCTIONS_EMULATOR ? 0 : 1]
    )
}