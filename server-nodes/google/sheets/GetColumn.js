import { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet"
import { MAX_ROWS, trimEmptyValues } from "./shared.js"


export default {
    id: "googlesheets:GetColumn",

    inputs: ["rowsOrSheet", "$column"],

    /**
     * @param {object} inputs
     * @param {GoogleSpreadsheetRow[] | [GoogleSpreadsheetWorksheet]} inputs.rowsOrSheet
     * @param {string} inputs.$column
     */
    async onInputsReady({ rowsOrSheet, $column }) {

        // Validate
        if (!$column) throw new Error("Must provide a column")

        // If this is an array of rows...
        if (rowsOrSheet.every(row => row instanceof GoogleSpreadsheetRow))
            return this.publish({
                values: rowsOrSheet.map(row => row[$column]),
            })

        // If this is a single sheet...
        if (rowsOrSheet[0] instanceof GoogleSpreadsheetWorksheet) {

            const sheet = rowsOrSheet[0]

            // Find index of column
            const columnIndex = sheet.headerValues.indexOf($column)
            if (columnIndex === -1)
                throw new Error(`Column "${$column}" not found in sheet "${sheet.title}"`)

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