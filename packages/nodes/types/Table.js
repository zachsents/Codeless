
export class Table extends Array {

    constructor(headers = []) {
        super()
        this.headers = headers
    }

    createRow(rowData) {
        return new Row(this, rowData)
    }

    loadFrom2DArray(data, { headers = [] } = {}) {
        this.headers = headers

        data.forEach(row => {
            this.push(
                this.createRow(Object.fromEntries(row.map(
                    (value, i) => {
                        this.headers[i] ||= i + 1
                        return [this.headers[i], value]
                    }
                )))
            )
        })
    }

    addRow(rowData) {
        const newRow = this.createRow(rowData)
        this.push(newRow)
        return newRow
    }

    static get [Symbol.species]() {
        return Array
    }
}


export class Row {
    constructor(table, data) {
        this.table = table
        this.data = data
    }

    get headers() {
        return this._headers ?? this.table.headers
    }

    get index() {
        return this.table.indexOf(this)
    }

    getColumn(name) {
        return this.data[name]
    }

    setColumn(name, value) {
        this.data[name] = value
    }

    toArray() {
        return this.headers.map(header => this.data[header])
    }
}


// const exampleData = [[2, 3, 53, 223], ["none", 34, 42, 123], [390, 304, 23, 125]]
// const exampleHeaders = ["money", "age", "# of something", "id"]

// const table = new Table()
// table.loadFrom2DArray(exampleData, { headers: exampleHeaders })
// table.log()

// // console.table({
// //     "Row 1": JSON.stringify(table.getRow(1)),
// //     "Row 1 (no headers)": JSON.stringify(table.getRow(1, false)),
// //     'Column "money"': JSON.stringify(table.getColumn("money")),
// // })


// console.log(table.findRow("id", 223))
// console.log(table.findRow("money", "no", (data, value) => data.includes?.(value)))