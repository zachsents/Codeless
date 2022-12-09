import { authorizeGoogleSheetsAPI } from "./auth.js"

export default {
    id: "googlesheets:Clear",
    name: "Clear Values in Sheets",
    targets: {
        values: {
            spreadsheetId: {},
            range: {},
        },
        signals: {
            " ": {
                async action() {
                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // read values from range
                    await sheets.spreadsheets.values.clear({
                        spreadsheetId: (await this.spreadsheetId)?.[0],
                        range: (await this.range)?.[0],
                    })
                }
            }
        }
    },
}
