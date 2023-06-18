import { google } from "@minus/server-lib"
import { GoogleSpreadsheet } from "google-spreadsheet"
import "./shared.js"


export default {
    id: "googlesheets:LoadSheet",

    inputs: [
        "$spreadsheetUrl",
        "$sheetName",
        "$headerRow",
    ],

    /**
     * @param {object} inputs
     * @param {string} inputs.$sheetName
     * @param {number} inputs.$headerRow
     */
    async onInputsReady({ $sheetName, $headerRow }) {

        // Validate
        if (!this.state.spreadsheetId) throw new Error("Must provide a spreadsheet URL")
        if (!$sheetName) throw new Error("Must provide a sheet name")

        // Initialize spreadsheet from google-spreadsheet package
        const doc = new GoogleSpreadsheet(this.state.spreadsheetId)

        // Authenticate with our Google OAuth2 client
        doc.useOAuth2Client(await google.getGoogleAPIFromNode(this, null))

        // Load spreadsheet info
        await doc.loadInfo()

        // Get sheet by name
        const sheet = doc.sheetsByTitle[$sheetName]

        // Load in headers
        await sheet.loadHeaderRow($headerRow ?? 1)

        this.publish({
            sheet,
            rowCount: sheet.rowCount,
            columnCount: sheet.columnCount,
        })
    },
}