import { GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from "google-spreadsheet"


GoogleSpreadsheetWorksheet.prototype.toString = function () {
    return `${this._spreadsheet.title} - ${this.title}`
}

GoogleSpreadsheetRow.prototype.toString = function () {
    return `Row ${this.rowIndex} in ${this._sheet.title}`
}


export const MAX_ROWS = 3000