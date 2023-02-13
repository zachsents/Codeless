import { arrayRemove } from "firebase/firestore"
import { revokeIntegration, updateApp } from "./app-actions.js"
import { functionUrl } from "./functions.js"


class GoogleIntegration {

    constructor(scopes) {
        this.scopes = scopes
    }

    authorizeAppInPopup(appId) {
        const params = new URLSearchParams({
            app_id: appId,
            scopes: this.scopes,
        })

        window.open(
            `${functionUrl("google-authorizeApp")}?${params.toString()}`
        )
    }

    isAppAuthorized(app) {
        return (app ?? false) &&
            this.scopes.every(scope => app?.integrations?.Google?.scopes?.includes(scope))
    }

    async revoke(appId) {
        await updateApp(appId, {
            "integrations.Google.scopes": arrayRemove(...this.scopes)
        })

        // TO DO: get a new token with the scope actually revoked. for now we're just 
        // deleting the scope stored in the database
    }
}


export const GmailIntegration = new GoogleIntegration([
    "https://www.googleapis.com/auth/gmail.modify",
])


export const GoogleSheetsIntegration = new GoogleIntegration([
    "https://www.googleapis.com/auth/spreadsheets",
])


export const AirTableIntegration = {

    authorizeAppInPopup(appId) {
        const params = new URLSearchParams({
            app_id: appId,
        })

        window.open(
            `${functionUrl("airtable-authorizeApp")}?${params.toString()}`
        )
    },

    isAppAuthorized(app) {
        return (app ?? false) &&
            !!app?.integrations?.AirTable?.refreshToken
    },

    revoke(appId) {
        revokeIntegration(appId, "AirTable")
    },
}
