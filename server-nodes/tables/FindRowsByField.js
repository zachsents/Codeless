import { Operation, TableField } from "@minus/server-sdk"
import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:FindRowsByField",

    inputs: ["$table", "field", "value", "$multiple"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-sdk/airtable/airtable.js").Table | 
     *  import("@minus/server-sdk/google/sheets.js").Table} inputs.$table
     * @param {*[]} inputs.value
     */
    async onInputsReady({ $table, field, value, $multiple }) {

        // build filters
        const filters = safeMap((field, value) => Operation.Equals(
            new TableField(field),
            value
        ), field, value)

        // execute query
        this.publish({
            rows: await $table.findRows({
                filters: filters,
                limit: $multiple ? null : 1,
            })
        })
    },
}