import { unzipObject, safeMap } from "../../arrayUtilities.js"


export default {
    id: "googlesheets:UpdateRows",

    inputs: ["rows", "data"],

    /**
     * Can't use the GoogleSpreadsheetRow.save method because it doesn't do batches.
     * Not scalable!!!
     * 
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetRow[]} inputs.rows
     */
    async onInputsReady({ rows, data }) {

        // Quit if there are no rows
        if (!rows.length)
            return

        // Map rows to update objects
        const updates = safeMap((row, data) => ({
            values: [row._sheet.headerValues.map(header => data[header])],
            range: row.a1Range,
            majorDimension: "ROWS",
        }), rows, unzipObject(data))

        // Set up request body
        const requestBody = {
            valueInputOption: "USER_ENTERED",
            includeValuesInResponse: false,
            responseValueRenderOption: "UNFORMATTED_VALUE",
            data: updates,
        }

        // Make request
        await rows[0]._sheet._spreadsheet.axios.post("/values:batchUpdate", requestBody)
    },
}