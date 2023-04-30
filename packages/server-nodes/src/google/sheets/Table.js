import { sheets } from "@minus/server-sdk"


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
     * @param {import("@minus/server-sdk").sheets.Sheet} inputs.$sheet
     */
    async onInputsReady({ $sheetName, $range, $headerRow, $dataStartRow }) {

        const sheetsApi = await sheets.getGoogleSheetsAPI()

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