import { sheets } from "@minus/server-sdk"


export default {
    id: "googlesheets:Spreadsheet",
    name: "Spreadsheet",

    inputs: [],
    outputs: ["_sheetRef"],

    async onStart() {
        const sheetsApi = await sheets.getGoogleSheetsAPI()
        this.publish({
            _sheetRef: sheetsApi.spreadsheet(this.state.spreadsheetId).sheet(this.state.sheetName)
        })
    },
}