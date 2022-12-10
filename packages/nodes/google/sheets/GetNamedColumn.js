import { authorizeGoogleSheetsAPI } from "./auth.js"
import { getEntireSheetValues } from "./shared.js"

export default {
    id: "googlesheets:GetNamedColumn",
    name: "Get Named Column",
    targets: {
        values: {
            // spreadsheetId: {},
            // sheetName: {},
            columnName: {},
        }
    },
    sources: {
        values: {
            data: {
                async get() {
                    // const spreadsheetId = (await this.spreadsheetId)?.[0]
                    // const sheetName = (await this.sheetName)?.[0]
                    const columnName = (await this.columnName)?.[0]

                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // get values for entire sheet (column-wise)
                    const table = await getEntireSheetValues(sheets, {
                        spreadsheetId: this.state.spreadsheetId,
                        sheetName: this.state.sheetName,
                        majorDimension: "COLUMNS",
                    })
                    
                    // search for column
                    let headerIndex
                    const columnData = table.find(col => {
                        headerIndex = col.findIndex(val => !!val)   // header is first truthy value
                        return col[headerIndex] == columnName
                    })
                        ?.slice(headerIndex + 1) ?? []

                    return columnData
                }
            }
        }
    }
}

