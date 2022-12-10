import { authorizeGoogleSheetsAPI } from "./auth.js"

export default {
    id: "googlesheets:ClearRange",
    name: "Clear Range in Sheets",
    targets: {
        values: {
            // spreadsheetId: {},
            range: {},
        },
        signals: {
            " ": {
                async action() {
                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // clear values in range
                    await sheets.spreadsheets.values.clear({
                        // spreadsheetId: (await this.spreadsheetId)?.[0],
                        spreadsheetId: this.state.spreadsheetId,
                        range: (await this.range)?.[0],
                    })
                }
            }
        }
    },
}
