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

    constructor(sheetName, startRow, startColumn, endRow, endColumn) {
        this.sheetName = sheetName
        this.singleCell = !endRow

        this.startRow = startRow
        this.startColumn = startColumn
        this.endRow = endRow
        this.endColumn = endColumn

        this.format = typeof startColumn == "string" ? Range.FORMAT_A1 : Range.FORMAT_RC
    }

    toString() {
        // create sheet prefix (e.g. 'Sheet1'!)
        const sheetPrefix = this.sheetName ? `'${this.sheetName}'!` : ""

        // create range string in either A1 or RC notation (e.g. A1:C5, D6, R2C5:R25C6)
        const rangeString = this.format == Range.FORMAT_A1 ?
            `${this.startColumn}${this.startRow}` + (this.singleCell ? "" : `:${this.endColumn}${this.endRow}`) :
            `R${this.startRow}C${this.startColumn}` + (this.singleCell ? "" : `:R${this.endRow}C${this.endColumn}`)

        return sheetPrefix + rangeString
    }
}