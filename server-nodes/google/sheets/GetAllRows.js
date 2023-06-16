import { GoogleSpreadsheetCellRow, MAX_ROWS } from "./shared.js"


export default {
    id: "googlesheets:GetAllRows",

    inputs: ["$sheet"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     */
    async onInputsReady({ $sheet }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        this.publish({
            rows: await GoogleSpreadsheetCellRow.fromRows(await $sheet.getRows({
                limit: MAX_ROWS,
            })),
        })
    },
}