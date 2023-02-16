import { google, sheets_v4 } from "googleapis"
import { getGoogleOAuthClient } from "./google.js"


let sheetsApi

export async function getGoogleSheetsAPI(appId = global.info.appId, {
    cache = true,
} = {}) {

    if (cache && sheetsApi)
        return sheetsApi

    const auth = await getGoogleOAuthClient(appId)

    // the sheets API is not extensible, but I'd like to add some features to it; thus, Proxy
    // sheetsApi = new Proxy(google.sheets({ version: "v4", auth }), {
    //     get: (target, prop, receiver) => {

    //         if (prop == "spreadsheet")
    //             return (...args) => new Spreadsheet(receiver, ...args)

    //         return Reflect.get(target, prop, receiver)
    //     }
    // })

    // instead, just using inheritance with Object.assign; if this causes problems, we'll switch back to Proxy
    sheetsApi = Object.assign(new ExtendedGoogleSheetsAPI(), google.sheets({ version: "v4", auth }))

    return sheetsApi
}



class ExtendedGoogleSheetsAPI extends sheets_v4.Sheets {

    constructor() {
        super()
    }

    spreadsheet(...args) {
        return new Spreadsheet(this, ...args)
    }
}


export class FieldFilter {

    static Equals = b => a => a == b
    static Contains = b => a => a.includes(b)
    static MatchesRegex = b => a => b.test(a)

    /**
     * Creates an instance of FieldFilter.
     * @param {string} field
     * @param {(x: *) => boolean} compareFunction
     * @memberof FieldFilter
     */
    constructor(field, compareFunction) {
        this._fields = [field]
        this.compareFunction = compareFunction
    }

    get fields() {
        return [...new Set(this._fields)]
    }

    /**
     * Joins two field filters
     *
     * @param {(a: boolean, b: boolean) => boolean} operation
     * @param {FieldFilter} fieldFilter
     * @return {FieldFilter} 
     * @memberof FieldFilter
     */
    join(operation, fieldFilter) {
        return Object.assign(new FieldFilter(), {
            fields: [...this._fields, ...fieldFilter._fields],
            compareFunction: (...args) => {
                return operation(
                    this.compareFunction(...args.slice(0, this._fields.length)),
                    fieldFilter.compareFunction(...args.slice(this._fields.length))
                )
            }
        })
    }

    and(fieldFilter) {
        return this.join((a, b) => a && b, fieldFilter)
    }

    or(fieldFilter) {
        return this.join((a, b) => a || b, fieldFilter)
    }

    test(record) {
        return this.compareFunction(
            ...this._fields.map(field => record[field])
        )
    }

    execute(records) {
        return records.filter(this.test.bind(this))
    }
}


class Row {

    /**
     * Creates an instance of Row.
     * @param {Table} table
     * @param {number} index
     * @memberof Row
     */
    constructor(table, index) {
        this.table = table
        this.index = index
    }

    get sheet() {
        return this.table.sheet
    }

    get spreadsheet() {
        return this.table.spreadsheet
    }

    get api() {
        return this.table.api
    }

    range() {
        const rowNumber = this.table.dataRange.startRow + this.index
        return this.table.dataRange.absolute(rowNumber, null, rowNumber, null)
    }

    getData() {
        return this.range().getData()
    }

    toString() {
        return `Row ${this.table.dataRange.startRow + this.index} in ${this.sheet.name}`
    }
}


export class Table {

    /**
     * Creates an instance of Table.
     * @param {Range} dataRange
     * @param {{ fields: string[] | undefined }} [{ fields }={}]
     * @memberof Table
     */
    constructor(dataRange, { fields } = {}) {
        this.dataRange = dataRange
        this.fields = fields
    }

    get sheet() {
        return this.dataRange.sheet
    }

    get spreadsheet() {
        return this.dataRange.spreadsheet
    }

    get api() {
        return this.dataRange.api
    }

    get(field) {
        return this.data?.[field]
    }

    row(...args) {
        return new Row(this, ...args)
    }

    /**
     * @param {object} options
     * @param {FieldFilter} options.filter
     * @param {number | undefined} options.limit
     * @memberof Table
     */
    async findRows({
        filter,
        limit,
        sortBy,
        sortOrder = "asc"
    } = {}) {
        // find which columns we need to get
        const filterFields = filter.fields.filter(field => this.fields.includes(field))

        // build ranges for those fields
        const ranges = filterFields.map(field => {
            const column = this.dataRange.startColumn + this.fields.indexOf(field)
            return this.dataRange.absolute(null, column, null, column).toString()
        })

        // query those fields
        const { data } = await this.api.spreadsheets.values.batchGetByDataFilter({
            spreadsheetId: this.spreadsheet.id,
            requestBody: {
                dataFilters: ranges.map(a1Range => ({ a1Range })),
                majorDimension: "COLUMNS",
            }
        })

        // transform the data into records
        const values = filterFields.map(
            (_, i) => data.valueRanges.find(vr => Range.stringsEqual(vr.valueRange.range, ranges[i]))?.valueRange.values[0]
        )
        const numRows = values[0]?.length ?? 0
        const records = Array(numRows).fill(0).map(
            (_, i) => ({
                ...Object.fromEntries(
                    filterFields.map((field, j) => [field, values[j][i]])
                ),
                _index: i,
            })
        )

        // filter the records & turn them into ranges
        let filteredRecords = filter.execute(records)
        // if we're not sorting, then limit before we fetch
        if (!sortBy)
            filteredRecords = filteredRecords.slice(0, limit)

        let filteredRows = filteredRecords.map(record => this.row(record._index))
        const filteredRowRanges = filteredRows.map(row => row.range().toString())

        // fetch those ranges
        const { data: rowData } = await this.api.spreadsheets.values.batchGetByDataFilter({
            spreadsheetId: this.spreadsheet.id,
            requestBody: {
                dataFilters: filteredRowRanges.map(a1Range => ({ a1Range })),
            }
        })

        // add data to each row object
        rowData.valueRanges.forEach(vr => {
            const index = filteredRowRanges.findIndex(range => Range.stringsEqual(range, vr.valueRange.range))

            filteredRows[index].data = this.fields ?
                Object.fromEntries(
                    vr.valueRange.values[0].map((val, i) => [this.fields[i], val])
                )
                :
                vr.valueRange.values[0]
        })

        // sort & limit
        if (sortBy) {
            filteredRows = filteredRows.sort((rowA, rowB) => {
                const a = rowA.get(sortBy)
                const b = rowB.get(sortBy)
                switch (sortOrder) {
                    case "asc": return a == b ? 0 : a > b ? -1 : 1
                    case "desc": return a == b ? 0 : a < b ? -1 : 1
                    default: return 0
                }
            }).slice(0, limit)
        }

        return filteredRows
    }
}


class Range {

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

    static stringsEqual(a, b) {
        const format = x => x.replaceAll("'", "")
        return format(a) == format(b)
    }

    /**
     * Creates an instance of Range.
     * @param {Sheet} sheet
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
            absOrRel(endColumn, this.endColumn),
        )
    }

    absolute(startRow, startColumn, endRow, endColumn) {
        return new Range(
            this.sheet,
            startRow ?? this.startRow,
            startColumn ?? this.startColumn,
            endRow ?? this.endRow,
            endColumn ?? this.endColumn,
        )
    }

    async asTable({
        headerRow = 1,
        dataStartRow = 2,
    } = {}) {
        const [fields] = await this.relative(headerRow - 1, 0, new Number(this.startRow + headerRow - 1), 0).getData()
        return new Table(this.relative(dataStartRow - 1, 0, 0, 0), { fields })
    }

    async getData({
        majorDimension = "ROWS",
        valueRenderOption = "UNFORMATTED_VALUE",
        ...otherOptions
    } = {}) {
        const { data } = await this.api.spreadsheets.values.get({
            spreadsheetId: this.spreadsheet.id,
            range: this.toString(),
            majorDimension,
            valueRenderOption,
            ...otherOptions,
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


export class Sheet {

    /**
     * Creates an instance of Sheet.
     * @param {Spreadsheet} spreadsheet
     * @param {string} name
     * @memberof Sheet
     */
    constructor(spreadsheet, name) {
        this.spreadsheet = spreadsheet
        this.name = name
    }

    get api() {
        return this.spreadsheet.api
    }

    range(...args) {
        if (args[0]?.constructor == Range) {
            args[0].sheet = this
            return args[0]
        }
        return new Range(this, ...args)
    }

    async asTable(options) {
        const details = await this.getDetails()
        return this.range(1, 1, details.gridProperties.rowCount, details.gridProperties.columnCount).asTable(options)
    }

    async getDetails() {
        const spreadsheetDetails = await this.spreadsheet.getDetails({ returnFullOutput: true })
        return spreadsheetDetails.sheets?.find(sheet => sheet.properties.title == this.name)?.properties
    }
}


class Spreadsheet {

    /**
     * Creates an instance of Spreadsheet.
     * @param {ExtendedGoogleSheetsAPI} api
     * @param {string} id
     * @memberof Spreadsheet
     */
    constructor(api, id) {
        this.api = api
        this.id = id
    }

    sheet(name) {
        return new Sheet(this, name)
    }

    async getDetails({
        returnFullOutput = false,
        ranges = [],
        includeGridData = false,
        ...otherOptions
    } = {}) {
        // get info about sheet
        let { data } = await this.api.spreadsheets.get({
            spreadsheetId: this.id,
            ranges,
            includeGridData,
            ...otherOptions
        })

        // either return everything or just basic info
        return returnFullOutput ? data : {
            name: data.properties.title,
            sheets: data.sheets.map(s => s.properties.title),
        }
    }
}


// WILO: just removed all dependency on the globalized google oauth client. Next, we are going to restructure
// the google sheets types and make the nodes more lazy