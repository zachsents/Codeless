import { unzipObject } from "../../arrayUtilities.js"
import { GoogleSpreadsheetCellRow } from "./shared.js"


export default {
    id: "googlesheets:AddRows",

    inputs: ["$sheet", "data"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {Object.<string, any[]>} inputs.data
     */
    async onInputsReady({ $sheet, data }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        // Add rows
        const addedRows = await $sheet.addRows(unzipObject(data))

        // Convert to CellRows
        this.publish({
            addedRows: await GoogleSpreadsheetCellRow.fromRows(addedRows),
        })
    },
}