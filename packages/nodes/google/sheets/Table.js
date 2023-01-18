import { Table } from "../../types/Table.js"
import { authorizeGoogleSheetsAPI } from "./auth.js"
import { Range } from "./types.js"


export default {
    id: "googlesheets:Table",
    name: "Table",

    inputs: ["sheet"],
    outputs: ["table"],

    async onInputsReady({ sheet }) {
        // get Google Sheets API
        const sheetsApi = await authorizeGoogleSheetsAPI()

        // construct range
        const range = new Range(sheet.sheetName, ...this.state.range)

        // read values from range
        const response = await sheetsApi.spreadsheets.values.get({
            spreadsheetId: sheet.spreadsheetId,
            range: range.toString(),
            majorDimension: "ROW",
            valueRenderOption: "UNFORMATTED_VALUE",
        })
        const values = response.data.values

        // split up headers from the actual data
        const headers = values[this.state.headerRow]
        const tableData = values.slice(this.state.startRow)

        // return in Table form
        const table = new Table()
        table.loadFrom2DArray(tableData, { headers })
        this.publish({ table })
    },
}