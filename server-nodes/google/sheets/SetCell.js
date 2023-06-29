import { safeMap } from "../../arrayUtilities.js"
import "./shared.js"


export default {
    id: "googlesheets:SetCell",

    inputs: ["$sheet", "cell", "value"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {string[]} inputs.cell
     * @param {*[]} inputs.value
     */
    async onInputsReady({ $sheet, cell, value }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        // Load cells
        await $sheet.loadCells(cell)

        // Set cell values
        safeMap((cell, value) => {
            $sheet.getCellByA1(cell).value = value
        }, cell, value)

        // Save changes
        await $sheet.saveUpdatedCells()
    }
}