

export default {
    id: "tables:RowWhere",
    name: "Row Where",

    inputs: ["$table", "$searchValue"],
    outputs: ["row"],

    onInputsReady({ $table, $searchValue }) {

        switch(this.state.compareMethod) {
            case "equals":
                var compareFunc = null
                break
            case "contains":
                var compareFunc = (data, value) => data.includes?.(value)
                break
            case "matches Regex":
                var compareFunc = (data, value) => value.test?.(data)
                break
        }

        this.publish({
            row: $table[`findRow${this.state.multiple ? "s" : ""}`](
                this.state.searchColumn,
                $searchValue,
                compareFunc
            )
        })
    },
}