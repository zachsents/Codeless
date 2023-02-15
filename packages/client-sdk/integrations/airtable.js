import { httpsCallable } from "firebase/functions"
import { functions } from "../firebase-init.js"


export function getTableNameFromId(params) {
    return httpsCallable(functions, "airtable-getTableNameFromId")(params)
}