import { MAX_ROWS } from "./shared.js"


export default {
    id: "googlesheets:GetAllRows",

    inputs: ["$sheet"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     */
    async onInputsReady({ $sheet }) {
        this.publish({
            rows: await $sheet.getRows({
                limit: MAX_ROWS,
            }),
        })
    },
}