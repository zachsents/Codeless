import { asyncMap } from "@minus/util"


export default {
    id: "googlesheets:DeleteRows",

    inputs: ["rows"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetRow[]} inputs.rows
     */
    async onInputsReady({ rows }) {
        await asyncMap(rows, row => row.delete())
    },
}