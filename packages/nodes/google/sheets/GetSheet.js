import { authorizeGoogleSheetsAPI } from "./auth.js"
import { getEntireSheetValues } from "./shared.js"

export default {
    id: "googlesheets:GetSheet",
    name: "Get Entire Sheet",
    targets: {
        values: {
            // spreadsheetId: {},
            // sheetName: {},
        }
    },
    sources: {
        values: {
            " ": {
                async get() {
                    // const spreadsheetId = (await this.spreadsheetId)?.[0]
                    // const sheetName = (await this.sheetName)?.[0]

                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // get values
                    return await getEntireSheetValues(sheets, {
                        spreadsheetId: this.state.spreadsheetId,
                        sheetName: this.state.sheetName,
                        majorDimension: this.state.majorDimension,
                    })
                }
            }
        }
    }
}

