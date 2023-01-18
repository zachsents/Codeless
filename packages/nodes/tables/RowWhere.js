

export default {
    id: "tables:RowWhere",
    name: "Row Where",

    inputs: ["table", "compare"],
    outputs: ["row"],

    onInputsReady({ table, compare }) {

        this.publish({
            row: table.findRow(
                this.state.searchColumn, 
                compare,
                this.state.compareMethod == "contains" ? (data, value) => data.includes?.(value) : null
            )
        })
    },
}