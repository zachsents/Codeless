import { GoogleSpreadsheetCellRow, MAX_ROWS } from "./shared.js"


export default {
    id: "googlesheets:LookupValues",

    inputs: ["values", "$lookupSheet", "$keyColumn"],

    /**
     * @param {object} inputs
     * @param {*[]} inputs.values
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$lookupSheet
     * @param {string} inputs.$keyColumn
     */
    async onInputsReady({ values, $lookupSheet, $keyColumn }) {

        // Validate
        if (!$lookupSheet) throw new Error("Must provide a Google Sheet")
        if (!$keyColumn) throw new Error("Must provide a column")

        // Load rows in lookup sheet
        const rows = await $lookupSheet.getRows({
            limit: MAX_ROWS,
        })

        // Make CellRows from rows
        const cellRows = await GoogleSpreadsheetCellRow.fromRows(rows)

        // Find corresponding row for each value
        const correspondingRows = values.map(value => cellRows.find(row => row.data[$keyColumn].value == value))

        this.publish({
            rows: correspondingRows,
        })
    }
}