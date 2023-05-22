import { sheets } from "@minus/server-lib"
import functions from "firebase-functions"


export const getSpreadsheetDetails = functions.https.onCall(async ({ accountId, spreadsheetId }) => {

    // Check params
    if (!accountId || !spreadsheetId)
        throw new functions.https.HttpsError("invalid-argument", "Must include an integration account ID and Google Sheets spreadsheet ID")

    // Get Sheets API
    const sheetsApi = await sheets.getGoogleSheetsAPI(accountId)

    // Get spreadsheet details
    return await sheetsApi.spreadsheet(spreadsheetId).getDetails()
})
