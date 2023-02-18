

export default {
    id: "tables:FindRows",
    name: "Row Where",

    inputs: ["$table", "filters"],
    outputs: ["row"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-sdk/airtable/airtable.js").Table | 
     *  import("@minus/server-sdk/google/sheets.js").Table} inputs.$table
     * @param {Operation[]} inputs.filters
     */
    async onInputsReady({ $table, filters }) {

        // execute query
        await $table.findRows({
            filters,
            limit: this.state.limit,
        })
            |> this.publish({ row: ^^ })
    },
}