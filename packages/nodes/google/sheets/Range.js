import { Table } from "../../types/Table.js"
import { authorizeGoogleSheetsAPI } from "./auth.js"
import { Range } from "./types.js"


export default {
    id: "googlesheets:Range",
    name: "Range",

    inputs: ["sheet"],
    outputs: ["data"],

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

        // return the values straight up if it's 1D or a single value
        if(values.length == 1) {
            if(values[0].length == 1)
                return values[0][0]
            return values[0]
        }

        // otherwise, return in Table form
        const table = new Table()
        table.loadFrom2DArray(values)
        this.publish({ data: table })
    },
}