

export default {
    id: "tables:RowWhere",
    name: "Row Where",

    inputs: ["$table", "$searchValue"],
    outputs: ["row"],

    onInputsReady({ $table, $searchValue }) {

        this.publish({
            row: $table[`findRow${this.state.multiple ? "s" : ""}`](
                this.state.searchColumn,
                $searchValue,
                this.state.compareMethod == "contains" ? (data, value) => data.includes?.(value) : null
            )
        })
    },
}