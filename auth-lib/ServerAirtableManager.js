import { ServerOAuth2Manager } from "./ServerOAuth2Manager.js"
import AirTableAPI from "airtable"


export class ServerAirtableManager extends ServerOAuth2Manager {

    /**
     * Creates an instance of ServerAirtableManager.
     * @param {import("./ServerOAuth2Manager.js").ServerOAuth2ManagerConfigurableOptions} options
     * @memberof ServerAirtableManager
     */
    constructor(options) {
        super({
            authorizationEndpoint: "https://airtable.com/oauth2/v1/authorize",
            tokenEndpoint: "https://airtable.com/oauth2/v1/token",
            whoamiEndpoint: "https://api.airtable.com/v0/meta/whoami",
            stateLength: 24,
            useCodeChallenge: true,
            codeVerifierLength: 64,
            closeWindowOnSuccess: true,
            debugPrefix: "Airtable",
            ...options,
        })
    }

    async getAPI(accountKey, additionalState) {
        return new AirTableAPI({
            apiKey: await this.getAccessToken(accountKey, additionalState),
            // ...options
        })
    }
}