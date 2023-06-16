import { GoogleSpreadsheetCellRow } from "./shared.js"


export default {
    id: "googlesheets:GetRow",

    inputs: ["$sheet", "index"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {number} inputs.index
     */
    async onInputsReady({ $sheet, index }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        this.publish({
            row: await GoogleSpreadsheetCellRow.fromRowIndexes($sheet, index)
        })
    }
}