import { google } from "googleapis"
import { getGoogleOAuthClient } from "./google.js"
import { ExtendedGoogleSheetsAPI } from "./sheets-types/ExtendedGoogleSheetsAPI.js"


let sheetsApi


/**
 * Gets a wrapped version of the Google Sheets API. Returns a cached version
 * if one's already been initialized, unless specified otherwise.
 * 
 * @param {string} [appId] 
 * @param {object} [options]
 * @param {boolean} [options.cache] 
 * @return {Promise<ExtendedGoogleSheetsAPI>}
 */
export async function getGoogleSheetsAPI(appId = global.info.appId, {
    cache = true,
} = {}) {

    if (cache && sheetsApi)
        return sheetsApi

    const auth = await getGoogleOAuthClient(appId)

    // the sheets API is not extensible, but I'd like to add some features to it; thus, Proxy
    // sheetsApi = new Proxy(google.sheets({ version: "v4", auth }), {
    //     get: (target, prop, receiver) => {

    //         if (prop == "spreadsheet")
    //             return (...args) => new Spreadsheet(receiver, ...args)

    //         return Reflect.get(target, prop, receiver)
    //     }
    // })

    // instead, just using inheritance with Object.assign; if this causes problems, we'll switch back to Proxy
    sheetsApi = Object.assign(new ExtendedGoogleSheetsAPI(), google.sheets({ version: "v4", auth }))

    return sheetsApi
}


export * from "./sheets-types/index.js"