import { GoogleSpreadsheetWorksheet } from "google-spreadsheet"
import { letterToColumn } from "google-spreadsheet/lib/utils.js"
import { GoogleSpreadsheetCellRow, MAX_ROWS, trimEmptyValues } from "./shared.js"


export default {
    id: "googlesheets:GetColumn",

    inputs: ["rowsOrSheet", "$column"],

    /**
     * @param {object} inputs
     * @param {GoogleSpreadsheetCellRow[] | [GoogleSpreadsheetWorksheet]} inputs.rowsOrSheet
     * @param {string} inputs.$column
     */
    async onInputsReady({ rowsOrSheet, $column }) {

        // Validate
        if (!$column) throw new Error("Must provide a column")

        // Skip empty arrays
        if (rowsOrSheet.length === 0)
            return this.publish({ values: [] })

        // If this is an array of rows...
        if (rowsOrSheet.every(row => row instanceof GoogleSpreadsheetCellRow)) {

            /** @type {GoogleSpreadsheetCellRow[]} */
            const rows = rowsOrSheet

            // Figure out column name
            let columnName
            const isHeaderName = rows[0]._sheet.headerValues.includes($column)
            const isColumnLetter = typeof $column === "string" && $column.match(/[A-Z]+/)
            const isColumnIndex = typeof $column === "number"

            if (isHeaderName)
                columnName = $column
            else if (isColumnLetter)
                columnName = rows[0]._sheet.headerValues[letterToColumn($column) - 1] // 1-based index
            else if (isColumnIndex)
                columnName = rows[0]._sheet.headerValues[$column - 1] // 1-based index
            else
                throw new Error(`Column "${$column}" not found`)

            return this.publish({
                values: rows.map(row => row.data[columnName].value),
            })
        }

        // If this is a single sheet...
        if (rowsOrSheet[0] instanceof GoogleSpreadsheetWorksheet) {

            const sheet = rowsOrSheet[0]

            // Figure out column index
            let columnIndex
            const isHeaderName = sheet.headerValues.includes($column)
            const isColumnLetter = typeof $column === "string" && $column.match(/[A-Z]+/)
            const isColumnIndex = typeof $column === "number"

            if (isHeaderName)
                columnIndex = sheet.headerValues.indexOf($column)
            else if (isColumnLetter)
                columnIndex = letterToColumn($column) - 1 // 1-based index
            else if (isColumnIndex)
                columnIndex = $column - 1 // 1-based index
            else
                throw new Error(`Column "${$column}" not found`)

            // Load in values
            const startRowIndex = sheet._headerRowIndex
            const endRowIndex = sheet._headerRowIndex + MAX_ROWS
            await sheet.loadCells({
                startRowIndex,
                endRowIndex,
                startColumnIndex: columnIndex,
                endColumnIndex: columnIndex + 1,
            })

            // Get values
            let values = []
            for (let i = startRowIndex; i < endRowIndex; i++) {
                try {
                    values.push(sheet.getCell(i, columnIndex).value)
                }
                catch (error) {
                    // Out of bounds, so we're done
                    break
                }
            }
            values = trimEmptyValues(values)

            return this.publish({ values })
        }

        throw new Error("Must provide a list of rows or a Google Sheet")
    }
}
