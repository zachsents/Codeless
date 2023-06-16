import { asyncMap } from "@minus/util"


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

        // Get rows
        const row = await asyncMap(index, async i => {

            if (i < $sheet._headerRowIndex)
                throw new Error(`Can't get row ${i} because it's before the header row`)

            // If this is the header row, return the header row
            if (i == $sheet._headerRowIndex)
                return $sheet.headerValues

            // Otherwise, return the row
            const result = await $sheet.getRows({
                offset: i - $sheet._headerRowIndex - 1,
                limit: 1,
            })

            return result[0]
        })

        this.publish({ row })
    }
}