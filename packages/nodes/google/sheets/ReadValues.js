import { google } from "googleapis"

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

                    // read values from range
                    const response = await sheets.spreadsheets.values.get({
                        spreadsheetId: (await this.spreadsheetId)?.[0],
                        range: (await this.range)?.[0],
                    })

                    return response.data.values
                }
            }
        }
    }
}

const AuthorizationError = new Error("Google Sheets service hasn't been authorized.")