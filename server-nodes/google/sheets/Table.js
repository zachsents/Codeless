import { google } from "@minus/server-lib"


export default {
    id: "googlesheets:Table",

    inputs: [
        "$spreadsheetUrl",
        "$sheetName",
        "$range",
        "$headerRow",
        "$dataStartRow",
    ],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-lib").sheets.Sheet} inputs.$sheet
     */
    async onInputsReady({ $sheetName, $range, $headerRow, $dataStartRow }) {

        const sheetsApi = await google.getGoogleAPIFromNode(this, "sheets", "v4")

        const sheet = sheetsApi.spreadsheet(this.state.spreadsheetId).sheet($sheetName)

        const tableOptions = {
            headerRow: $headerRow,
            dataStartRow: $dataStartRow,
        }

        const table = this.state.useEntireSheet ?
            await sheet.asTable(tableOptions) :
            await sheet.range($range).asTable(tableOptions)

        this.publish({ table })
    },
}