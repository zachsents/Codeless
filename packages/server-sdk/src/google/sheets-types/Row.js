

export class Row {

    /**
     * Creates an instance of Row.
     * @param {import("./Table.js").Table} table
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

    async getData({ refetch = false } = {}) {
        if (this.data && !refetch)
            return this.data

        this.data = await this.range().getData()
        return this.data
    }

    async getField(field, { refetch = false } = {}) {
        // TO DO: make it just fetch single field
        return await this.getData({ refetch })
            |> ^^ [field]
    }

    toString() {
        return `Row ${this.table.dataRange.startRow + this.index} in ${this.sheet.name}`
    }
}
