import { httpsCallable } from "firebase/functions"
import { disconnectIntegration } from "./app-actions.js"
import { functions } from "./firebase-init.js"
import { functionUrl } from "./functions.js"


class OAuthAuthManager {

    constructor(name, {
        authorizeFunction,
        checkAuthorizationFunction,
    } = {}) {
        this.name = name
        this.authorizeFunction = authorizeFunction
        this.checkAuthorizationFunction = checkAuthorizationFunction
    }

    authorizeAppInPopup(appId, additionalParams = {}) {
        const params = new URLSearchParams({
            app_id: appId,
            ...additionalParams,
        })

        window.open(`${functionUrl(this.authorizeFunction)}?${params.toString()}`)
    }

    async isAppAuthorized(app) {
        if (!app)
            return false

        const { data } = await httpsCallable(functions, this.checkAuthorizationFunction)({ appId: app.id })
        return data
    }

    oneClickAuth = this.authorizeAppInPopup

    async disconnect(appId) {
        await disconnectIntegration(appId, this.name)
    }
}

class GoogleAuthManager extends OAuthAuthManager {

    constructor(scopes) {
        super("google", { 
            authorizeFunction: "google-authorizeApp",
            checkAuthorizationFunction: "google-checkAuthorization",
        })
        this.scopes = scopes
    }

    authorizeAppInPopup(appId) {
        super.authorizeAppInPopup(appId, {
            scopes: this.scopes,
        })
    }

    async isAppAuthorized(app) {
        if (!app)
            return false

        const { data } = await httpsCallable(functions, this.checkAuthorizationFunction)({ 
            appId: app.id, 
            requiredScopes: this.scopes 
        })
        return data
    }

    // TO DO: get a new token with the scope actually revoked. for now we're just 
    // deleting the scope stored in the database
}

// Google Apps

export const GmailAuthManager = new GoogleAuthManager([
    "https://www.googleapis.com/auth/gmail.modify",
])

export const GoogleSheetsAuthManager = new GoogleAuthManager([
    "https://www.googleapis.com/auth/spreadsheets",
])


// Other Apps

export const AirTableAuthManager = new OAuthAuthManager("airtable", {
    authorizeFunction: "airtable-authorizeApp",
    checkAuthorizationFunction: "airtable-checkAuthorization",
})
