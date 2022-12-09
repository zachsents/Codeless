import { google } from "googleapis"
import { authorizeGoogleAPIs } from "../auth.js"


export async function authorizeGoogleSheetsAPI() {
    
    const auth = await authorizeGoogleAPIs(new Error("Google Sheets service hasn't been authorized."))
    
    return google.sheets({ version: "v4", auth })
}
