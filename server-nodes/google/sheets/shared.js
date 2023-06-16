import { GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from "google-spreadsheet"


GoogleSpreadsheetWorksheet.prototype.toString = function () {
    return `${this._spreadsheet.title} - ${this.title}`
}

GoogleSpreadsheetRow.prototype.toString = function () {
    return `Row ${this.rowIndex} in ${this._sheet.title}`
}

// GoogleSpreadsheetCell.prototype.toString = function () {
//     return `Cell ${this.a1Address} in ${this._sheet.title}`
// }

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


export class GoogleSpreadsheetCellRow {

    /** @type {Object.<string, import("google-spreadsheet").GoogleSpreadsheetCell>} */
    data

    /**
     * Creates an instance of GoogleSpreadsheetCellRow.
     * @param {GoogleSpreadsheetWorksheet} sheet
     * @memberof GoogleSpreadsheetCellRow
     */
    constructor(sheet) {
        this._sheet = sheet
        this.data = {}
    }

    get rowIndex() {
        const cell = Object.values(this.data)[0]
        return cell ? cell.rowIndex + 1 : undefined
    }

    toString() {
        return `Row ${this.rowIndex} in ${this._sheet.title}`
    }

    /**
     * @static
     * @param {GoogleSpreadsheetRow[]} rows
     * @memberof GoogleSpreadsheetCellRow
     */
    static async fromRows(rows) {
        // Make sure this is an array
        if (!Array.isArray(rows))
            rows = [rows]

        if (!rows.length)
            return []

        // Load cells all at once
        await rows[0]._sheet.loadCells(rows.map(row => row.a1Range))

        // Map to new CellRows
        return rows.map(row => {
            const cellRow = new GoogleSpreadsheetCellRow(row._sheet)

            // Attach cells to data
            row._sheet.headerValues.forEach((header, i) => {
                cellRow.data[header] = row._sheet.getCell(row.rowIndex - 1, i)
            })

            return cellRow
        })
    }

    /**
     * @static
     * @param {GoogleSpreadsheetWorksheet} sheet
     * @param {number[]} rowIndexes Row indexes (1-indexed)
     * @memberof GoogleSpreadsheetCellRow
     */
    static async fromRowIndexes(sheet, rowIndexes) {
        // Make sure this is an array
        if (!Array.isArray(rowIndexes))
            rowIndexes = [rowIndexes]

        if (!rowIndexes.length)
            return []

        // Load cells all at once
        await sheet.loadCells(rowIndexes.map(index => ({
            startRowIndex: index - 1,
            endRowIndex: index,
            startColumnIndex: 0,
            endColumnIndex: sheet.headerValues.length,
        })))

        // Map to new CellRows
        return rowIndexes.map(index => {
            const cellRow = new GoogleSpreadsheetCellRow(sheet)

            // Check if row index is above header row
            if (index <= sheet._headerRowIndex)
                throw new Error(`Row index ${index} is above header row`)

            // Attach cells to data
            sheet.headerValues.forEach((header, i) => {
                cellRow.data[header] = sheet.getCell(index - 1, i)
            })

            return cellRow
        })
    }
}