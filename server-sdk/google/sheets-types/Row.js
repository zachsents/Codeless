

export class Row {

    static recordToArray(record, fields) {
        return fields.map(field => record[field])
    }

    static arrayToRecord(arr, fields) {
        return Object.fromEntries(
            arr.map((item, i) => [fields[i], item])
        )
    }

    /**
     * Creates an instance of Row.
     * @param {import("./Table.js").Table} table
     * @param {number} index
     * @memberof Row
     */
    constructor(table, index, data) {
        this.table = table
        this.index = index
        this.data = data
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

    async getData({ refetch = false } = {}) {
        if (this.data && !refetch)
            return this.data

        this.data = await this.range().getData()
        return this.data
    }

    async getField(field, { refetch = false } = {}) {
        // TO DO: make it just fetch single field
        return (await this.getData({ refetch }))[field]
    }

    toString() {
        return `Row ${this.table.dataRange.startRow + this.index} in ${this.sheet.name}`
    }
}
