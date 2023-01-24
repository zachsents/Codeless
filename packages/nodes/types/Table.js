
export class Table {

    constructor() {
        this.headers = []
        this.rows = []
    }

    loadFrom2DArray(data, { headers } = {}) {
        this.rows = data.map(
            row => Object.fromEntries(row.map(
                (value, i) => {
                    this.headers[i] = headers?.[i] ?? i
                    return [this.headers[i], value]
                }
            ))
        )
    }

    log() {
        console.table(this.rows)
    }

    getRow(index, includeHeaders = true) {
        return includeHeaders ? new Row(this, this.rows[index]) : Object.values(this.rows[index])
    }

    getColumn(name) {
        return this.rows.map(row => row[name])
    }

    findRow(columnName, value, compareFunction) {
        const row = this.rows.find(row => compareFunction?.(row[columnName], value) ?? (row[columnName] == value))
        return row && new Row(this, row)
    }

    addRow(row) {
        this.rows.push(row)
    }

    [Symbol.iterator]() {
        const This = this
        let index = -1

        return {
            next: () => ({ 
                value: new Row(This, this.rows[++index]), 
                done: !(index in this.rows) 
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