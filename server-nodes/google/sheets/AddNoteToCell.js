import { safeMap } from "../../arrayUtilities.js"
import "./shared.js"


export default {
    id: "googlesheets:AddNoteToCell",

    inputs: ["$sheet", "cell", "note"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {string[]} inputs.cell
     * @param {string[]} inputs.note
     */
    async onInputsReady({ $sheet, cell, note }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        // Load cells
        await $sheet.loadCells(cell)

        // Set cell values
        safeMap((cell, note) => {
            $sheet.getCellByA1(cell).note = note
        }, cell, note)

        // Save changes
        await $sheet.saveUpdatedCells()
    }
}