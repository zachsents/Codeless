import { functionUrl } from "./functions.js"


export const GoogleIntegration = {

    authorizeAppInPopup(appId, scopes) {
        const params = new URLSearchParams({
            app_id: appId,
            scopes,
        })

        window.open(
            `${functionUrl("google-authorizeApp")}?${params.toString()}`
        )
    },

    isAppAuthorized(app, requiredScopes = []) {
        return (app ?? false) &&
            requiredScopes.every(scope => app?.integrations?.Google?.scopes?.includes(scope))
    }
}


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
    }
}