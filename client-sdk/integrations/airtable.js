import { httpsCallable } from "firebase/functions"
import { useQuery } from "react-query"
import { functions } from "../firebase-init.js"


/**
 * Gets the Airtable table name from a Base ID and Table ID. Requires an
 * app ID for authentication, as well.
 *
 * @export
 * @param {string} accountId Integration account ID
 * @param {string} baseId Airtable Base ID
 * @param {string} tableId Airtable Table ID
 * @return {Promise<string>} 
 */
export async function getTableNameFromId(accountId, baseId, tableId) {

    if (!accountId || !baseId || !tableId)
        return console.warn("Invalid arguments or not authenticated")

    return httpsCallable(functions, "airtable-getTableNameFromId")({ accountId, baseId, tableId }).then(res => res.data)
}


export function useTableNameFromId(accountId, baseId, tableId) {
    const { data: tableName, ...result } = useQuery(
        ["airtable-table-name", accountId, baseId, tableId],
        () => getTableNameFromId(accountId, baseId, tableId)
    )

    return { tableName, ...result }
}