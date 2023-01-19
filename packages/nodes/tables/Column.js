

export default {
    id: "tables:Column",
    name: "Column",

    inputs: ["$table"],
    outputs: ["column"],

    onInputsReady({ $table }) {

        this.publish({
            column: $table.getColumn(this.state.column)
        })
    },
}