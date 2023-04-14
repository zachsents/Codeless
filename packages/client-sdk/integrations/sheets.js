import { httpsCallable } from "firebase/functions"
import { useQuery } from "react-query"
import { functions } from "../firebase-init.js"


/**
 * Gets the name and sheets in a Google Sheet. Also requires app ID
 * for authentication.
 *
 * @export
 * @param {string} appId Minus App ID
 * @param {string} spreadsheetId Google Sheets Spreadsheet ID
 * @return {Promise<{ name: string, sheets: string[] }>} 
 */
export async function getSpreadsheetDetails(appId, spreadsheetId) {

    if (!appId || !spreadsheetId)
        throw new Error("Must provide app ID and spreadsheet ID")

    const { data } = await httpsCallable(functions, "sheets-getSpreadsheetDetails")({ appId, spreadsheetId })
    return data
}


export function useSpreadsheetDetails(appId, spreadsheetId) {
    return useQuery({
        queryKey: ["googlesheets-spreadsheet-details", appId, spreadsheetId],
        queryFn: () => getSpreadsheetDetails(appId, spreadsheetId),
        retry: false,
    })
}