
export class Table {

    constructor(headers = [], rows = []) {
        this.headers = headers
        this.rows = rows
    }

    loadFrom2DArray(data, { headers = [] } = {}) {
        const This = this
        this.headers = headers

        this.rows = data.map(
            row => This.createRow(Object.fromEntries(row.map(
                (value, i) => {
                    this.headers[i] ??= i
                    return [this.headers[i], value]
                }
            )))
        )
    }

    log() {
        console.table(this.rows.map(row => row.data))
    }

    createRow(rowData) {
        return new Row(this, rowData)
    }

    getRow(index) {
        return this.rows[index]
    }

    findRow(columnName, value, compareFunction = (a, b) => a == b) {
        const row = this.rows.find(
            row => compareFunction(row.data[columnName], value)
        )
        return row
    }

    findRows(columnName, value, compareFunction = (a, b) => a == b) {
        const rows = this.rows.filter(
            row => compareFunction(row.data[columnName], value)
        )
        return rows
    }

    addRow(rowData) {
        const newRow = this.createRow(rowData)
        this.rows.push(newRow)
        return newRow
    }

    getColumn(name) {
        return this.rows.map(row => row.getColumn(name))
    }

    setColumn(name, value) {
        const values = value.map ? value : [value]

        this.rows.forEach((row, i) => {
            row.setColumn(name, values[i] ?? values[0])
        })
    }

    [Symbol.iterator]() {
        const This = this
        let index = -1

        return {
            next: () => ({
                value: This.rows[++index],
                done: !(index in This.rows)
            })
        }
    }
}


export class Row {
    constructor(table, data) {
        this.table = table
        this.data = data
    }

    getColumn(name) {
        return this.data[name]
    }

    setColumn(name, value) {
        this.data[name] = value
    }

    get index() {
        return this.table.rows.indexOf(this)
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