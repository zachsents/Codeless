import { authorizeGoogleSheetsAPI } from "./auth.js"

export default {
    id: "googlesheets:ReadValues",
    name: "Get Values From Sheets",
    targets: {
        values: {
            spreadsheetId: {},
            range: {},
        }
    },
    sources: {
        values: {
            " ": {
                async get() {
                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // read values from range
                    const response = await sheets.spreadsheets.values.get({
                        spreadsheetId: (await this.spreadsheetId)?.[0],
                        range: (await this.range)?.[0],
                        majorDimension: this.state.majorDimension,
                        valueRenderOption: "UNFORMATTED_VALUE",
                    })

                    return response.data.values
                }
            }
        }
    }
}

