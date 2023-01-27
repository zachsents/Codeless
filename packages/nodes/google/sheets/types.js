import { Row, Table } from "../../types/Table.js"

export class GoogleSheetTable extends Table {

    constructor(api, sheetReference, range, options = {}) {
        super()
        this.api = api
        this.sheetReference = sheetReference
        this.range = range

        this.options = options
    }

    createRow(rowData) {
        return new GoogleSheetsRow(this, rowData)
    }

    async addRow(rowData) {
        const newRow = this.createRow(rowData)

        // hit API
        await this.api.spreadsheets.values.append({
            spreadsheetId: this.sheetReference.spreadsheetId,
            range: this.range.toString(),
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                majorDimension: "ROWS",
                values: [newRow.toArray()],
            },
        })

        // once it successfully gets added to the Sheet, we can add it to our local copy
        this.push(newRow)
        return newRow
    }
}

export class GoogleSheetsRow extends Row {
    constructor(table, data) {
        super(table, data)
    }

    get sheetRow() {
        return this.table.range.startRow + this.table.options.startRow + this.index - 1
    }

    async setColumn(name, value) {
        super.setColumn(name, value)

        // create range for just this row
        const range = Object.assign(new Range(), this.table.range, {
            startRow: this.sheetRow,
            endRow: this.sheetRow,
        })

        // hit API
        await this.table.api.spreadsheets.values.update({
            spreadsheetId: this.table.sheetReference.spreadsheetId,
            range: range.toString(),
            valueInputOption: "USER_ENTERED",
            requestBody: {
                majorDimension: "ROWS",
                values: [this.toArray()],
            },
        })
    }
}

export class SheetReference {

    constructor(spreadsheetId, sheetName) {
        this.spreadsheetId = spreadsheetId
        this.sheetName = sheetName
    }
}


export class Range {

    static FORMAT_RC = "rc"
    static FORMAT_A1 = "a1"

    static lettersToNumber(column) {
        let result = 0
        for (let i = 0; i < column.length; i++) {
            result *= 26;
            result += column.charCodeAt(i) - 64
        }
        return result
    }

    static numberToLetters(number) {
        let result = ""
        while (number > 0) {
            let remainder = number % 26
            remainder ||= 26

            result = String.fromCharCode(remainder + 64) + result
            number = (number - remainder) / 26
        }
        return result
    }

    constructor(sheetName, startRow, startColumn, endRow, endColumn) {
        this.sheetName = sheetName

        this.startRow = startRow
        this.startColumn = typeof startColumn == "string" ? Range.lettersToNumber(startColumn) : startColumn
        this.endRow = endRow
        this.endColumn = typeof endColumn == "string" ? Range.lettersToNumber(endColumn) : endColumn
    }

    get singleCell() {
        return this.endRow == null || this.endColumn == null
    }

    toString(format = Range.FORMAT_A1) {
        // create sheet prefix (e.g. 'Sheet1'!)
        const sheetPrefix = this.sheetName ? `'${this.sheetName}'!` : ""

        // create range string in A1 notation (e.g. A1:C5, D6)
        if (format == Range.FORMAT_A1)
            return sheetPrefix + `${Range.numberToLetters(this.startColumn)}${this.startRow}` +
                (this.singleCell ? "" : `:${Range.numberToLetters(this.endColumn)}${this.endRow}`)

        // create range string in RC notation (e.g. R2C5:R25C6)
        if (format == Range.FORMAT_RC)
            return sheetPrefix + `R${this.startRow}C${this.startColumn}` +
                (this.singleCell ? "" : `:R${this.endRow}C${this.endColumn}`)
    }
}