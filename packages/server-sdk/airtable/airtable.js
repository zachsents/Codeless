import fs from "fs/promises"
import { createHash } from "crypto"
import { nanoid } from "nanoid"
import fetch from "node-fetch"
import path from "path"
import { fileURLToPath } from "url"
import { FieldValue } from "firebase-admin/firestore"
import AirTableAPI from "airtable"


const AuthDetails = await getAuthDetails()
const OAuthChallengesCollection = db.collection("oauthChallenges")


export async function generateAuthUrl({
    scopes = AuthDetails.scopes,
    state,
} = {}) {

    // generate code challenge
    const randomState = nanoid(24)
    const codeVerifier = nanoid(64)
    const hash = createHash("sha256")
    hash.update(codeVerifier)
    const codeChallenge = hash.digest("base64url")

    // store state & code challenge in database
    await OAuthChallengesCollection.doc(
        Buffer.from(codeChallenge, "base64url").toString("hex")
    ).set({
        verifier: codeVerifier,
        randomState,
        state,
    })

    // set up params
    const params = new URLSearchParams({
        client_id: AuthDetails.client_id,
        redirect_uri: AuthDetails.redirect_uri,
        response_type: "code",
        scope: scopes.join(" "),
        state: randomState,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    })

    // construct URL
    return `${AuthDetails.endpoints.auth}?${params.toString()}`
}


export async function getTokenFromGrantCode({ code, randomState, codeChallenge }) {

    // find challenge document in database
    const challengeDoc = await OAuthChallengesCollection.doc(
        Buffer.from(codeChallenge, "base64url").toString("hex")
    ).get()

    if (!challengeDoc.exists)
        throw new Error("Can't find code challenge document")

    const { state, randomState: storedRandomState, verifier } = challengeDoc.data()

    // verify random state
    if (randomState != storedRandomState)
        throw new Error("Random state doesn't match")

    // make token request
    const tokenResponse = await getToken({
        code,
        redirect_uri: AuthDetails.redirect_uri,
        grant_type: "authorization_code",
        code_verifier: verifier,
    })

    return { ...tokenResponse, state }
}


export async function getAirTableAPI(appId = global.info.appId, options = {}) {
    const freshToken = await getFreshAccessToken(appId)
    return new AirTableAPI({ apiKey: freshToken, ...options })
}


async function getFreshAccessToken(appId = global.info.appId) {

    if (!appId)
        throw new Error("Must include app ID")

    const appRef = db.doc(`apps/${appId}`)

    /** 
     * This code must be atomic to prevent refresh tokens from being used more than
     * once. This will revoke access (https://airtable.com/developers/web/api/oauth-reference#token-expiry-refresh-tokens)
     */
    const freshToken = await db.runTransaction(async t => {
        // get app
        let appDoc = await t.get(appRef)
        const { accessToken, refreshToken } = appDoc.data().integrations.AirTable

        if (!refreshToken)
            return null

        if (accessToken) {
            // console.debug(`Trying out access token... (${accessToken})`)

            // try out access token
            let res = await (await fetch("https://api.airtable.com/v0/meta/whoami", {
                headers: { "Authorization": "Bearer " + accessToken }
            })).json()

            // token is OK! send it
            if (!res.error)
                return accessToken

            // console.debug("Access token is bad")
        }

        // refresh tokens
        const newTokens = await getToken({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }).catch(() => ({}))    // empty object as return will cause the next lines to delete bad tokens

        // console.debug(`Got new token: ${newTokens.access_token}`)

        // write new tokens
        await t.update(appRef, {
            "integrations.AirTable.refreshToken": newTokens.refresh_token ?? FieldValue.delete(),
            "integrations.AirTable.accessToken": newTokens.access_token ?? FieldValue.delete(),
        })

        return newTokens.access_token
    })

    if (!freshToken)
        throw new Error("AirTable is not authorized")

    return freshToken
}


async function getToken(bodyParams = {}) {

    // make token request
    const response = await fetch(AuthDetails.endpoints.token, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + Buffer.from(`${AuthDetails.client_id}:${AuthDetails.secret}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(bodyParams).toString()
    })
    const { scope, ...responseBody } = await response.json()

    // check for errors
    if (responseBody.error)
        throw new Error(`${responseBody.error}: ${responseBody.error_description}`)

    return {
        scopes: scope.split(" "),
        ...responseBody,
    }
}


async function getAuthDetails() {
    const detailsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "./airtable_secret.json")
    
    const { production, development, ...authDetails } = JSON.parse(await fs.readFile(detailsPath, "utf-8"))
    return {
        ...authDetails,
        ...(process.env.FUNCTIONS_EMULATOR ? development : production)
    }
}


export * from "./types.js"