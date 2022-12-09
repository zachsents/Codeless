import { isDeeper } from "../../arrayUtilities.js"
import { authorizeGoogleSheetsAPI } from "./auth.js"

export default {
    id: "googlesheets:Append",
    name: "Appends Values to a Table in Sheets",
    targets: {
        values: {
            spreadsheetId: {},
            range: {},
            values: {},
        },
        signals: {
            " ": {
                async action() {
                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // make sure input array is two-dimensional
                    const inputs = await this.values
                    const writeValues = isDeeper(inputs) ? inputs : [inputs]

                    // read values from range
                    await sheets.spreadsheets.values.append({
                        spreadsheetId: (await this.spreadsheetId)?.[0],
                        range: (await this.range)?.[0],
                        valueInputOption: "USER_ENTERED",
                        insertDataOption: "INSERT_ROWS",
                        requestBody: {
                            majorDimension: this.state.majorDimension,
                            values: writeValues,
                        },
                    })
                }
            }
        }
    },
}
