import { sheets } from "@minus/server-sdk"


export default {
    id: "googlesheets:Range",

    inputs: [
        "$spreadsheetUrl",
        "$sheetName",
        "$range",
    ],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-sdk").sheets.Sheet} inputs.$sheet
     */
    async onInputsReady({ $sheetName, $range }) {

        const sheetsApi = await sheets.getGoogleSheetsAPI()

        const sheet = sheetsApi.spreadsheet(this.state.spreadsheetId).sheet($sheetName)

        // create range and get data
        const data = await sheet.range($range).getData()

        // favor single items
        this.publish({
            values: data.length == 1 ?
                data[0].length == 1 ?
                    data[0][0] :
                    data[0] :
                data,
        })
    },
}