import { isDeeper } from "../../arrayUtilities.js"
import { authorizeGoogleSheetsAPI } from "./auth.js"

export default {
    id: "googlesheets:SetRange",
    name: "Set Range In Sheets",
    targets: {
        values: {
            // spreadsheetId: {},
            range: {},
            values: {},
        },
        signals: {
            " ": {
                async action(x) {
                    // get Google Sheets API
                    const sheets = await authorizeGoogleSheetsAPI()

                    // make sure input array is two-dimensional
                    const inputs = await this.values
                    const writeValues = isDeeper(inputs) ? inputs : [inputs]

                    // read values from range
                    await sheets.spreadsheets.values.update({
                        // spreadsheetId: (await this.spreadsheetId)?.[0],
                        spreadsheetId: this.state.spreadsheetId,
                        range: (await this.range)?.[0],
                        valueInputOption: "USER_ENTERED",
                        requestBody: {
                            majorDimension: this.state.majorDimension,
                            values: writeValues,
                        },
                    })

                    await this["  "](x)
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
