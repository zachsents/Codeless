import { Table } from "../../types/Table.js"
import { authorizeGoogleSheetsAPI } from "./auth.js"
import { getEntireSheetValues } from "./shared.js"


export default {
    id: "googlesheets:Table",
    name: "Table",

    inputs: ["$sheet"],
    outputs: ["table"],

    async onInputsReady({ $sheet }) {
        // get Google Sheets API
        const sheetsApi = await authorizeGoogleSheetsAPI()

        // either use entire sheet
        if (this.state.useEntireSheet) {
            var values = await getEntireSheetValues(sheetsApi, {
                spreadsheetId: $sheet.spreadsheetId,
                sheetName: $sheet.sheetName,
                majorDimension: "ROWS",
            })
        }
        // or just a range
        else {
            // construct range
            const range = new Range($sheet.sheetName, ...this.state.range)

            // read values from range
            const response = await sheetsApi.spreadsheets.values.get({
                spreadsheetId: $sheet.spreadsheetId,
                range: range.toString(),
                majorDimension: "ROWS",
                valueRenderOption: "UNFORMATTED_VALUE",
            })
            var values = response.data.values
        }

        // split up headers from the actual data
        const headers = this.state.headerRow > 0 ? values[this.state.headerRow - 1] : null
        const tableData = values.slice(this.state.startRow - 1)

        // return in Table form
        const table = new Table()
        table.loadFrom2DArray(tableData, { headers })
        this.publish({ table })
    },
}