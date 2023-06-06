import { authManager, getGoogleAPIFromNode } from "../auth.js"
import { ExtendedGoogleSheetsAPI } from "./types/ExtendedGoogleSheetsAPI.js"


export async function getGoogleSheetsAPI(accountId) {
    const sheetsApi = await authManager.getAPI(accountId, {
        api: "sheets",
        version: "v4",
    })

    return Object.assign(new ExtendedGoogleSheetsAPI(), sheetsApi)
}

export async function getGoogleSheetsAPIFromNode(node) {
    const sheetsApi = await getGoogleAPIFromNode(node, "sheets", "v4")
    return Object.assign(new ExtendedGoogleSheetsAPI(), sheetsApi)
}

export * from "./types/index.js"