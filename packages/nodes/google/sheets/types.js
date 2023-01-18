
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