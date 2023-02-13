import fs from "fs/promises"
import functions from "firebase-functions"
import { nanoid } from "nanoid"
import { db } from "./init.js"
import { createHash } from "crypto"
import { logger } from "./logger.js"
import fetch from "node-fetch"


const OAuthChallengesCollection = db.collection("oauthChallenges")


export const authorizeApp = functions.https.onRequest(async (request, response) => {

    // read details from secret file
    const { endpoints, scopes, client_id, redirect_uri } = await getAuthDetails()

    // generate state & code challenge & store in database
    const state = nanoid(24)
    const codeVerifier = nanoid(64)
    const hash = createHash("sha256")
    hash.update(codeVerifier)
    const codeChallenge = hash.digest("base64url")
    await OAuthChallengesCollection.doc(
        Buffer.from(codeChallenge, "base64url").toString("hex")
    ).set({
        verifier: codeVerifier,
        state,
        appId: request.query.app_id,
    })

    // generate auth URL
    const authUrl = new URL(endpoints.auth)
    authUrl.searchParams.set("client_id", client_id)
    authUrl.searchParams.set("redirect_uri", redirect_uri)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", scopes.join(" "))
    authUrl.searchParams.set("state", state)
    authUrl.searchParams.set("code_challenge", codeChallenge)
    authUrl.searchParams.set("code_challenge_method", "S256")

    response.redirect(authUrl.toString())
})


export const appAuthorizationRedirect = functions.https.onRequest(async (request, response) => {

    logger.setPrefix("AirTable")

    const {
        code, state, code_challenge,
        error, error_description
    } = request.query

    // check for errors
    if (error)
        fail(response, { error, error_description })

    // verify code challenge & state
    const challengeDoc = await OAuthChallengesCollection.doc(
        Buffer.from(code_challenge, "base64url").toString("hex")
    ).get()
    if (!challengeDoc.exists) {
        failCodeVerification(response)
        return
    }
    const { state: storedState, verifier, appId } = challengeDoc.data()
    if (!verifier || state != storedState) {
        failCodeVerification(response)
        return
    }

    // get auth details
    const { endpoints, secret, client_id, redirect_uri } = await getAuthDetails()

    // make token request
    const tokenRequestBody = new URLSearchParams({
        code,
        redirect_uri,
        grant_type: "authorization_code",
        code_verifier: verifier,
    })

    const tokenResponse = await fetch(endpoints.token, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + Buffer.from(`${client_id}:${secret}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenRequestBody.toString()
    })
    const tokenResponseBody = await tokenResponse.json()

    // check for errors
    if (tokenResponseBody.error)
        fail(response, tokenResponseBody, tokenResponse.status)

    // success! store tokens & scopes
    await db.doc(`apps/${appId}`).update({
        "integrations.AirTable.refreshToken": tokenResponseBody.refresh_token,
        "integrations.AirTable.accessToken": tokenResponseBody.access_token,
        "integrations.AirTable.scopes": tokenResponseBody.scope.split(" "),
    })

    logger.log(`Succesfully authorized AirTable for app "${appId}"`)

    // response with JS to close the popup window
    response.send("<script>window.close()</script>")
})


function failCodeVerification(res) {
    logger.log("Code challenge verification failed.")
    res.status(401).send({ error: "Code challenge verification failed." })
}


function fail(res, { error, error_description }, status = 500) {
    res.status(status).send({ error })
    throw new Error(`Received error from AirTable: ${error}\n${error_description}`)
}


async function getAuthDetails() {
    const { production, development, ...authDetails } = JSON.parse(await fs.readFile("./airtable_secret.json", "utf-8"))
    return {
        ...authDetails,
        ...(process.env.FUNCTIONS_EMULATOR ? development : production)
    }
}