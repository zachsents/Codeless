import { ServerOAuth2Manager } from "./ServerOAuth2Manager.js"
import { nanoid } from "nanoid"
import { google } from "googleapis"


export class ServerGoogleManager extends ServerOAuth2Manager {

    /**
     * Creates an instance of ServerGoogleManager.
     * @param {import("./ServerOAuth2Manager.js").ServerOAuth2ManagerConfigurableOptions} options
     * @memberof ServerGoogleManager
     */
    constructor(options) {
        super({
            whoamiEndpoint: "https://api.airtable.com/v0/meta/whoami",
            stateLength: 24,
            closeWindowOnSuccess: true,
            debugPrefix: "Google",
            ...options,
        })

        this.options.scopes = [
            ...this.options.scopes,
            "https://www.googleapis.com/auth/userinfo.email",
        ]
    }


    getGoogleOAuth2Client(refreshToken) {
        const client = new google.auth.OAuth2(
            this.options.clientId,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            this.options.callbackUrl[process.env.FUNCTIONS_EMULATOR ? 0 : 1]
        )

        refreshToken && client.setCredentials({
            refresh_token: refreshToken,
        })

        return client
    }


    async generateAuthUrl(payload) {

        // Generate state
        const state = nanoid(this.options.stateLength)

        // Store state & code challenge
        await this.options.setState({
            state,
            payload,
        })

        // Generate auth URL
        return this.getGoogleOAuth2Client().generateAuthUrl({
            access_type: "offline",
            scope: this.options.scopes,
            state,
            include_granted_scopes: true,
        })
    }


    async handleAuthorizationCallback(req, res) {

        // Pull out query params
        const {
            code: grantCode,
            state,
        } = req.query

        // Get state
        const storedDocument = await this.options.getState(state)

        // Check if state exists
        if (!storedDocument)
            this.throw(res, { error: "invalid_state", description: "State doesn't exist" })

        // Get OAuth client
        const client = await this.getGoogleOAuth2Client()

        // Get the tokens
        const { tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expiry_date: expiresAt,
            token_type: tokenType,
            id_token: idToken,
        } } = await client.getToken(grantCode)

        // TO DO: add check for stored refresh token. If one doesn't come back from
        // this request and we don't have one stored, then we need to tell the user to
        // revoke access and try again.

        // Get email & granted scopes
        const { email, scopes: grantedScopes } = await this.whoAmI(accessToken)

        if (!email)
            this.throw(res, { error: "couldnt_obtain_email", description: "Wasn't able to get email from token info. Scope might not be set." })

        // Store auth info
        await this.options.setAuthInfo.call(this, this.options.createAccountKey(email), {
            userId: email,
            accessToken,
            refreshToken,
            expiresAt,
            tokenType,
            idToken,
            scopes: grantedScopes,
            payload: storedDocument.payload,
        })

        // Respond
        this.responseToSuccessfulAuthorization(res)
    }

    async getAccessToken() {
        throw new Error("getAccessToken() is not supported for Google. Use getAPI() instead.")
    }

    async isAuthorized(accountKey, { scopes, ...additionalState } = {}) {

        // Function for checking if all scopes are authorized
        const isAuthorizedForAllScopes = (grantedScopes, debug) => {
            const authorized = scopes.every(scope => grantedScopes.includes(scope))
            console.debug(
                this.options.debugPrefix,
                `${authorized ? "" : "NOT "}authorized for these scopes (${debug}):`,
                scopes.map(s => `\n\t${s}`).join(",")
            )
            return authorized
        }

        // Get auth info
        const authInfo = await this.options.getAuthInfo.call(this, accountKey, additionalState)

        // Check if refresh token exists
        if (!authInfo?.refreshToken)
            this.throw(undefined, { error: "no_refresh_token", description: "No refresh token" })

        // Get OAuth client
        const client = this.getGoogleOAuth2Client(authInfo.refreshToken)

        // See if scopes have been checked in the last 5 minutes
        if (
            authInfo.scopes && authInfo.scopesCheckedAt &&
            ServerGoogleManager.isWithinCachedTimePeriod(authInfo.scopesCheckedAt)
        )
            return isAuthorizedForAllScopes(authInfo.scopes, "cached check in last 5 mins")

        // Grab new list of granted scopes
        const { scopes: grantedScopes } = await this.whoAmI(
            await client.getAccessToken().then(res => res.token)
        )

        // Store new scope info
        await this.options.setAuthInfo.call(this, accountKey, {
            ...authInfo,
            scopes: grantedScopes,
            scopesCheckedAt: Date.now(),
        }, additionalState)

        // Return result
        return isAuthorizedForAllScopes(grantedScopes, "via whoami")
    }

    async getAPI(accountKey, { api, ...additionalState }) {
        // Get auth info
        const authInfo = await this.options.getAuthInfo.call(this, accountKey, additionalState)

        // Get OAuth client
        const client = this.getGoogleOAuth2Client(authInfo.refreshToken)

        // Return OAuth2 client if no API specified
        if (!api)
            return client

        return google[api]({
            auth: client,
            ...additionalState,
        })
    }

    async whoAmI(accessToken) {
        const client = this.getGoogleOAuth2Client()
        return await client.getTokenInfo(accessToken)
    }
}