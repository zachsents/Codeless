import { httpsCallable } from "firebase/functions"
import { functions } from "../firebase-init.js"


export function getSpreadsheetDetails(params) {
    return httpsCallable(functions, "sheets-getSpreadsheetDetails")(params)
}