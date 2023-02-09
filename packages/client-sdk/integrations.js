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