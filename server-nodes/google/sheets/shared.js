import { GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from "google-spreadsheet"


GoogleSpreadsheetWorksheet.prototype.toString = function () {
    return `${this._spreadsheet.title} - ${this.title}`
}

GoogleSpreadsheetRow.prototype.toString = function () {
    return `Row ${this.rowIndex} in ${this._sheet.title}`
}

/**
 * This method is used in GoogleSpreadsheetWorksheet.getRows. This way, it'll default
 * to using the UNFORMATTED_VALUE valueRenderOption.
 * 
 * Note: this may cause issues if a header is a number or boolean and another method
 * relies on it being a string. This is an unlikely scenario, though. If it happens,
 * fuck it.
 */
GoogleSpreadsheetWorksheet.prototype.getCellsInRange = async function (a1Range, options) {
    const response = await this._spreadsheet.axios.get(`/values/${this.encodedA1SheetName}!${a1Range}`, {
        params: {
            valueRenderOption: "UNFORMATTED_VALUE",
            majorDimension: "ROWS",
            ...options,
        },
    })
    return response.data.values
}

export const MAX_ROWS = 3000


export function trimEmptyValues(values) {
    const newArr = [...values]
    while (newArr.at(-1) == null)
        newArr.pop()
    return newArr
}

