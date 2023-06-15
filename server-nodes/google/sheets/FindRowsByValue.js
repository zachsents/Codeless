import { MAX_ROWS } from "./shared.js"


export default {
    id: "googlesheets:FindRowsByValue",

    inputs: ["$sheet", "$column", "$value"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {string} inputs.$column
     * @param {*} inputs.$value
     */
    async onInputsReady({ $sheet, $column, $value }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")
        if (!$column) throw new Error("Must provide a column")

        // Load rows
        const rows = await $sheet.getRows({
            limit: MAX_ROWS,
        })

        // Filter rows
        const filteredRows = rows.filter(row => row[$column] == $value)

        this.publish({ rows: filteredRows })
    }
}