import { sheets_v4 } from "googleapis"
import { Spreadsheet } from "./Spreadsheet.js"


export class ExtendedGoogleSheetsAPI extends sheets_v4.Sheets {

    constructor() {
        super()
    }

    spreadsheet(...args) {
        return new Spreadsheet(this, ...args)
    }
}
