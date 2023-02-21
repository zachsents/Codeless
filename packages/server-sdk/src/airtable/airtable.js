import fs from "fs/promises"
import { createHash } from "crypto"
import { nanoid } from "nanoid"
import fetch from "node-fetch"
import path from "path"
import { fileURLToPath } from "url"
import AirTableAPI from "airtable"
import { logger } from "../logger.js"
import { getIntegrationAccount, removeIntegrationAccount, storeIntegrationAccount } from "../integrations.js"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


export const AirTableIntegrationKey = "airtable"
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

    logger.setPrefix("Airtable Auth")

    if (!appId)
        throw new Error("Must include app ID")

    const appRef = db.doc(`apps/${appId}`)

    /** 
     * This code must be atomic to prevent refresh tokens from being used more than
     * once. This will revoke access (https://airtable.com/developers/web/api/oauth-reference#token-expiry-refresh-tokens)
     */
    const freshToken = await db.runTransaction(async t => {
        // get app
        const appDoc = await t.get(appRef)
        const app = { id: appDoc.id, ...appDoc.data() }

        // get stored integration account
        const { id: userId, accessToken, refreshToken } = await getIntegrationAccount({
            app,
            integrationKey: AirTableIntegrationKey,
            transaction: t,
        })

        if (!refreshToken)
            return null

        // try out access token
        if (accessToken) {
            try {
                await getWhoAmI(accessToken)
                // token is OK! send it
                logger.debug("Access token is OK!")
                return accessToken
            }
            catch (err) {
                logger.debug("Bad access token. Refreshing")
            }
        }

        // refresh tokens
        const newTokens = await getToken({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }).catch(() => null)    // empty object as return will cause the next lines to delete bad tokens

        // there was an error - let's delete the integration account
        if (!newTokens) {
            logger.debug("Refresh token is bad. Deleting integration account")
            await removeIntegrationAccount({
                app,
                integrationKey: AirTableIntegrationKey,
                transaction: t,
            })
            return null
        }

        logger.debug("Refreshed tokens.")

        // store new tokens
        await storeIntegrationAccount(AirTableIntegrationKey, userId, {
            refreshToken: newTokens.refresh_token,
            accessToken: newTokens.access_token,
        }, {
            transaction: t,
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


/**
 * Does a whoami request to Airtable
 *
 * @export
 * @param {string} accessToken
 * @return {Promise<{ id: string, scopes: string[] }>} 
 */
export async function getWhoAmI(accessToken) {

    const res = await (await fetch("https://api.airtable.com/v0/meta/whoami", {
        headers: { "Authorization": "Bearer " + accessToken }
    })).json()

    if (res.error)
        throw new Error(res.error.message)

    return res
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
