import { Operation, TableField } from "@minus/server-sdk"


export default {
    id: "tables:FindRowsByField",
    name: "Find Rows By Field",

    inputs: ["$table", "value"],
    outputs: ["rows"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-sdk/airtable/airtable.js").Table | 
     *  import("@minus/server-sdk/google/sheets.js").Table} inputs.$table
     * @param {*[]} inputs.value
     */
    async onInputsReady({ $table, value }) {

        // build filter -- this node checks for equality with any of the provided values 
        const filters = value.map(val => Operation.Equals(new TableField(this.state.field), val))
            |> Operation.Or(...^^)

        // execute query
        await $table.findRows({
            filters: [filters],
            limit: this.state.multiple ? null : 1,
        })
            |> this.publish({ rows: ^^ })
    },
}