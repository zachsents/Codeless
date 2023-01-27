

export default {
    id: "tables:RowWhere",
    name: "Row Where",

    inputs: ["table", "$searchValue"],
    outputs: ["row"],

    onInputsReady({ table, $searchValue }) {

        switch(this.state.compareMethod) {
            case "equals":
                var compareFunc = (data, value) => data == value
                break
            case "contains":
                var compareFunc = (data, value) => data.includes?.(value)
                break
            case "matches Regex":
                var compareFunc = (data, value) => value.test?.(data)
                break
        }

        // find either one row or multiple rows
        const rows = table[this.state.multiple ? "filter" : "find"](
            row => compareFunc(row.getColumn(this.state.searchColumn), $searchValue)
        )

        this.publish({
            row: rows
        })
    },
}