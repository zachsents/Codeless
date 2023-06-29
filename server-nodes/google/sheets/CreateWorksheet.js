import { GoogleSpreadsheet } from "google-spreadsheet"
import { google } from "@minus/server-lib"
import "./shared.js"


export default {
    id: "googlesheets:CreateWorksheet",

    inputs: ["$spreadsheetUrl", "$name", "$headerRow", "$headers"],

    /**
     * @param {object} inputs
     * @param {string} inputs.$name
     * @param {number} inputs.$headerRow
     * @param {string[]} inputs.$headers
     */
    async onInputsReady({ $name, $headerRow, $headers }) {

        // Validate
        if (!this.state.spreadsheetId) throw new Error("Must provide a spreadsheet URL")

        // Initialize spreadsheet from google-spreadsheet package
        const doc = new GoogleSpreadsheet(this.state.spreadsheetId)

        // Authenticate with our Google OAuth2 client
        doc.useOAuth2Client(await google.getGoogleAPIFromNode(this, null))

        // Load spreadsheet info
        await doc.loadInfo()

        // Check if sheet already exists
        if (doc.sheetsByTitle[$name]) throw new Error("Sheet already exists")

        // See if we should add headers
        const shouldAddHeaders = Array.isArray($headers) && $headers.some(Boolean) && typeof $headerRow === "number"

        // Add sheet
        const sheet = await doc.addSheet({
            title: $name,
            ...shouldAddHeaders && {
                headerValues: $headers,
                headerRowIndex: $headerRow,
            },
        })

        this.publish({ sheet })
    },
}