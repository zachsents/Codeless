import functions from "firebase-functions"
import fetch from "node-fetch"
import { airtable, storeIntegrationAccount, logger } from "@minus/server-sdk"


export const authorizeApp = functions.https.onRequest(async (request, response) => {

    if (!request.query.app_id) {
        response.status(400).send({ error: "Must include an app ID" })
        throw new Error("Must include app ID")
    }

    response.redirect(
        await airtable.generateAuthUrl({
            state: { appId: request.query.app_id }
        })
    )
})


export const appAuthorizationRedirect = functions.https.onRequest(async (request, response) => {

    logger.setPrefix("AirTable")

    const {
        code, state: randomState, code_challenge,
        error, error_description
    } = request.query

    // check for errors
    if (error)
        fail(response, { error, error_description })

    // get token
    const { refresh_token, access_token, scopes, state: { appId } } = await airtable.getTokenFromGrantCode({
        code,
        randomState,
        codeChallenge: code_challenge,
    })

    // get user ID
    const { id: userId } = await airtable.getWhoAmI(access_token)

    // success! store airtable account
    await storeIntegrationAccount(airtable.AirTableIntegrationKey, userId, {
        refreshToken: refresh_token,
        accessToken: access_token,
        scopes,
    }, { appId })

    logger.log(`Succesfully authorized AirTable for app "${appId}"`)
    logger.done()

    // response with JS to close the popup window
    response.send("<script>window.close()</script>")
})


export const checkAuthorization = functions.https.onCall(async ({ appId }) => {
    try {
        await airtable.getAirTableAPI(appId)
        console.log("Airtable is authorized :)")
        return true
    }
    catch(err) {
        console.log("Airtable is not authorized >:(")
        return false
    }
})


export const getTableNameFromId = functions.https.onCall(async (data) => {

    const { appId, baseId, tableId } = data

    // check params
    if (!appId || !baseId || !tableId)
        throw new functions.https.HttpsError("invalid-argument", "Must include Minus app ID and Airtable base ID and table ID")

    // grab API
    const at = await airtable.getAirTableAPI(appId)

    // airtable.js doesn't provide access to the Metadata API
    const res = await (await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
        headers: {
            "Authorization": "Bearer " + at._apiKey,
        }
    })).json()

    // check for errors
    if (res.error)
        throw new functions.https.HttpsError("unknown", `${res.error.type}: ${res.error.message}`)

    return res.tables?.find(table => table.id == tableId)?.name
})


function fail(res, { error, error_description }, status = 500) {
    res?.status(status).send({ error })
    throw new Error(`Received error from AirTable: ${error}\n${error_description}`)
}