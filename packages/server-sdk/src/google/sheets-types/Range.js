import { Table } from "./Table.js"


export class Range {

    static FORMAT_RC = "rc"
    static FORMAT_A1 = "a1"

    static lettersToNumber(column) {
        let result = 0
        for (let i = 0; i < column.length; i++) {
            result *= 26
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

    static stringsEqual(a, b) {
        const format = x => x.toString().replaceAll("'", "")
        return format(a) == format(b)
    }

    /**
     * Creates an instance of Range.
     * @param {import("./Sheet.js").Sheet} sheet
     * @param {number} startRow
     * @param {number | string} startColumn
     * @param {number} endRow
     * @param {number | string} endColumn
     * @memberof Range
     */
    constructor(sheet, startRow, startColumn, endRow, endColumn) {
        this.sheet = sheet

        this.startRow = startRow
        this.startColumn = typeof startColumn == "string" ? Range.lettersToNumber(startColumn) : startColumn
        this.endRow = endRow
        this.endColumn = typeof endColumn == "string" ? Range.lettersToNumber(endColumn) : endColumn
    }

    get singleCell() {
        return !this.endRow && !this.endColumn
    }

    get spreadsheet() {
        return this.sheet?.spreadsheet
    }

    get api() {
        return this.sheet?.api
    }

    get rows() {
        return this.endRow - this.startRow
    }

    get columns() {
        return this.endColumn - this.startColumn
    }

    /**
     * Creates a new Range relative to the old one. Use the Number constructor
     * to provide an absolute value.
     *
     * @param {number} startRow
     * @param {number} startColumn
     * @param {number} endRow
     * @param {number} endColumn
     * @return {Range}
     * @memberof Range
     */
    relative(startRow, startColumn, endRow, endColumn) {
        const absOrRel = (newVal, oldVal) => typeof newVal === "number" ? oldVal + newVal : newVal.valueOf()
        return new Range(
            this.sheet,
            absOrRel(startRow, this.startRow),
            absOrRel(startColumn, this.startColumn),
            absOrRel(endRow, this.endRow),
            absOrRel(endColumn, this.endColumn)
        )
    }

    absolute(startRow, startColumn, endRow, endColumn) {
        return new Range(
            this.sheet,
            startRow ?? this.startRow,
            startColumn ?? this.startColumn,
            endRow ?? this.endRow,
            endColumn ?? this.endColumn
        )
    }

    async asTable({
        headerRow = 1, dataStartRow = 2,
    } = {}) {
        const [fields] = await this.relative(headerRow - 1, 0, new Number(this.startRow + headerRow - 1), 0).getData()
        return new Table(this.relative(dataStartRow - 1, 0, 0, 0), { fields })
    }

    async getData({
        majorDimension = "ROWS", valueRenderOption = "UNFORMATTED_VALUE", ...otherOptions
    } = {}) {
        const { data } = await this.api.spreadsheets.values.get({
            spreadsheetId: this.spreadsheet.id,
            range: this.toString(),
            majorDimension,
            valueRenderOption,
            ...otherOptions
        })
        return data.values
    }

    toString(format = Range.FORMAT_A1) {
        // create sheet prefix (e.g. 'Sheet1'!)
        const sheetPrefix = this.sheet?.name ? `'${this.sheet.name}'!` : ""

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
