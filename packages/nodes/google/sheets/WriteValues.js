import { google } from "googleapis"
import { isDeeper } from "../../arrayUtilities.js"

export default {
    id: "googlesheets:WriteValues",
    name: "Set Values In Sheets",
    targets: {
        values: {
            spreadsheetId: {},
            range: {},
            values: {},
        },
        signals: {
            " ": {
                async action() {
                    // grab stored refresh token
                    const appSnapshot = await global.admin.firestore().doc(`apps/${global.info.appId}`).get()
                    const refreshToken = appSnapshot.data().integrations?.Google?.refreshToken

                    if (!refreshToken)
                        throw AuthorizationError

                    // authorize OAuth2 client with stored token
                    global.oauthClient.setCredentials({
                        refresh_token: refreshToken,
                    })

                    // get Google Sheets API
                    const sheets = google.sheets({ version: "v4", auth: global.oauthClient })

                    // make sure input array is two-dimensional
                    const inputs = await this.values
                    const writeValues = isDeeper(inputs) ? inputs : [inputs]

                    // read values from range
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: (await this.spreadsheetId)?.[0],
                        range: (await this.range)?.[0],
                        valueInputOption: "USER_ENTERED",
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

const AuthorizationError = new Error("Google Sheets service hasn't been authorized.")