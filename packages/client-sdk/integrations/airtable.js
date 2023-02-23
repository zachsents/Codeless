import { httpsCallable } from "firebase/functions"
import { useQuery } from "react-query"
import { functions } from "../firebase-init.js"


/**
 * Gets the Airtable table name from a Base ID and Table ID. Requires an
 * app ID for authentication, as well.
 *
 * @export
 * @param {string} appId Minus App ID
 * @param {string} baseId Airtable Base ID
 * @param {string} tableId Airtable Table ID
 * @return {Promise<string>} 
 */
export async function getTableNameFromId(appId, baseId, tableId) {

    if (!appId || !baseId || !tableId)
        return console.warn("Invalid arguments or not authenticated")

    const { data } = await httpsCallable(functions, "airtable-getTableNameFromId")({ appId, baseId, tableId })
    return data
}


export function useTableNameFromId(appId, baseId, tableId) {
    const { data: tableName, ...result } = useQuery(
        ["airtable-table-name", appId, baseId, tableId],
        () => getTableNameFromId(appId, baseId, tableId)
    )

    return { tableName, ...result }
}