import { google } from "googleapis"

export default {
    id: "googlesheets:Range",
    name: "Range",
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

                    const appSnapshot = await admin.firestore().doc(`apps/${global.info.appId}`).get()
                    // TO DO: figure out how to authenticate with token from database
                    // google.sheets({version: 'v4', auth})
                }
            }
        }
    }
}