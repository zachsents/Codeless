import { httpsCallable } from "firebase/functions"
import { useQuery } from "react-query"
import { functions } from "../firebase-init.js"


/**
 * Gets the name and sheets in a Google Sheet. Also requires app ID
 * for authentication.
 *
 * @export
 * @param {string} accountId Integration account ID
 * @param {string} spreadsheetId Google Sheets Spreadsheet ID
 * @return {Promise<{ name: string, sheets: string[] }>} 
 */
export async function getSpreadsheetDetails(accountId, spreadsheetId) {

    if (!accountId || !spreadsheetId)
        throw new Error("Must provide account ID and spreadsheet ID")

    const { data } = await httpsCallable(functions, "sheets-getSpreadsheetDetails")({ accountId, spreadsheetId })
    return data
}


export function useSpreadsheetDetails(accountId, spreadsheetId) {
    return useQuery({
        queryKey: ["googlesheets-spreadsheet-details", accountId, spreadsheetId],
        queryFn: () => getSpreadsheetDetails(accountId, spreadsheetId),
        retry: false,
    })
}