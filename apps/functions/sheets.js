import functions from "firebase-functions"
import { sheets } from "@minus/server-sdk"


export const getSpreadsheetDetails = functions.https.onCall(async (data, context) => {

    const { appId, spreadsheetId } = data

    // check params
    if(!appId || !spreadsheetId)
        throw new functions.https.HttpsError("invalid-argument", "Must include Minus app ID and Google Sheets spreadsheet ID")

    // get sheets API
    const sheetsApi = await sheets.getGoogleSheetsAPI(appId)
    
    // get spreadsheet details
    return await sheetsApi.spreadsheet(spreadsheetId).getDetails()
})
