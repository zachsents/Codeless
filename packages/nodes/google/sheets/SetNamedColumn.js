import { isDeeper } from "../../arrayUtilities.js"
import { authorizeGoogleSheetsAPI } from "./auth.js"
import { getEntireSheetValues } from "./shared.js"

export default {
    id: "googlesheets:SetNamedColumn",
    name: "Set Named Column",
    targets: {
        values: {
            // spreadsheetId: {},
            // sheetName: {},
            columnName: {},
            data: {},
        },
        signals: {
            " ": {
                async action(x) {
                    // const spreadsheetId = (await this.spreadsheetId)?.[0]
                    // const sheetName = (await this.sheetName)?.[0]
                    const columnName = (await this.columnName)?.[0]
                    const data = await this.data

                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // get values for entire sheet (column-wise)
                    const table = await getEntireSheetValues(sheets, {
                        spreadsheetId: this.state.spreadsheetId,
                        sheetName: this.state.sheetName,
                        majorDimension: "COLUMNS",
                    })
                    
                    // search for column
                    let rowIndex
                    const columnIndex = table.findIndex(col => {
                        rowIndex = col.findIndex(val => !!val)   // header is first truthy value
                        return col[rowIndex] == columnName
                    }) + 1
                    rowIndex += 2

                    // set values in range
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: this.state.spreadsheetId,
                        range: `'${this.state.sheetName}'!R${rowIndex}C${columnIndex}:R${rowIndex + data.length}C${columnIndex}`,
                        valueInputOption: "USER_ENTERED",
                        requestBody: {
                            majorDimension: "COLUMNS",
                            // values: isDeeper(data) ? data : [data],
                            values: [data],
                        },
                    })

                    this["  "](x)
                }
            }
        }
    },
    sources: {
        signals: {
            "  ": {}
        }
    }
}
