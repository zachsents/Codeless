import { arrayRemove } from "firebase/firestore"
import { revokeIntegration, updateApp } from "./app-actions.js"
import { functionUrl } from "./functions.js"


class OAuthIntegration {

    constructor(name, { authorizeFunction } = {}) {
        this.name = name
        this.authorizeFunction = authorizeFunction
    }

    authorizeAppInPopup(appId, additionalParams = {}) {
        const params = new URLSearchParams({
            app_id: appId,
            ...additionalParams,
        })

        window.open(`${functionUrl(this.authorizeFunction)}?${params.toString()}`)
    }

    isAppAuthorized(app) {
        return (app ?? false) &&
            !!app?.integrations?.[this.name]?.refreshToken
    }

    async revoke(appId) {
        await revokeIntegration(appId, this.name)
    }
}

class GoogleIntegration extends OAuthIntegration {

    constructor(name, scopes) {
        super(name, { authorizeFunction: "google-authorizeApp" })
        this.scopes = scopes
    }

    authorizeAppInPopup(appId) {
        super.authorizeAppInPopup(appId, {
            scopes: this.scopes,
        })
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

// Google Apps

export const GmailIntegration = new GoogleIntegration("Gmail", [
    "https://www.googleapis.com/auth/gmail.modify",
])

export const GoogleSheetsIntegration = new GoogleIntegration("GoogleSheets", [
    "https://www.googleapis.com/auth/spreadsheets",
])


// Other Apps

export const AirTableIntegration = new OAuthIntegration("AirTable", { 
    authorizeFunction: "airtable-authorizeApp" 
})