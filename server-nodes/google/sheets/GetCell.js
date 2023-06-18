import "./shared.js"


export default {
    id: "googlesheets:GetCell",

    inputs: ["$sheet", "cell"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {string[]} inputs.cell
     */
    async onInputsReady({ $sheet, cell }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        // Load cells
        await $sheet.loadCells(cell)

        // Get cells
        const value = cell.map(c => $sheet.getCellByA1(c).value)

        this.publish({ value })
    }
}