import { unzipObject, safeMap } from "../../arrayUtilities.js"
import "./shared.js"


export default {
    id: "googlesheets:UpdateRows",

    inputs: ["rows", "data"],

    /**
     * Can't use the GoogleSpreadsheetRow.save method because it doesn't do batches.
     * Not scalable!!!
     * 
     * @param {object} inputs
     * @param {import("./shared.js").GoogleSpreadsheetCellRow[]} inputs.rows
     * @param {Object.<string, any[]>} inputs.data
     */
    async onInputsReady({ rows, data }) {

        // Quit if there are no rows
        if (!rows.length)
            return

        // Update each row
        safeMap((row, data) => {
            Object.entries(data).forEach(([header, value]) => {
                if (row.data[header])
                    row.data[header].value = value
            })
        }, rows, unzipObject(data))

        // Save updates
        await rows[0]._sheet.saveUpdatedCells()
    },
}