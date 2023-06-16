import "./shared.js"


export default {
    id: "googlesheets:DeleteRows",

    inputs: ["rows"],

    /**
     * Can't use the GoogleSpreadsheetRow.delete method because it doesn't do batches.
     * Not scalable!!!
     * 
     * @param {object} inputs
     * @param {import("./shared.js").GoogleSpreadsheetCellRow[]} inputs.rows
     */
    async onInputsReady({ rows }) {

        // Quit if there are no rows
        if (!rows.length) return

        // Map rows to delete requests
        const requests = rows.map(row => ({
            deleteDimension: {
                range: {
                    sheetId: row._sheet.sheetId,
                    dimension: "ROWS",
                    startIndex: row.rowIndex - 1,
                    endIndex: row.rowIndex,
                }
            }
        }))

        // Make request
        await rows[0]._sheet._spreadsheet._makeBatchUpdateRequest(requests)
    },
}