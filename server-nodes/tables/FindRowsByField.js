import { Operation, TableField } from "@minus/server-lib"
import { delist, safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:FindRowsByField",

    inputs: ["$table", "field", "value", "multiple"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-lib/airtable/index.js").Table | 
     *  import("@minus/server-lib/google").sheets.Table} inputs.$table
     * @param {string[]} inputs.field
     * @param {any[]} inputs.value
     * @param {boolean[]} inputs.multiple
     */
    async onInputsReady({ $table, field, value, multiple }) {

        // build filters
        const filters = safeMap((field, value) => Operation.Equals(
            new TableField(field),
            value
        ), field, value)

        // execute queries
        const queryResult = await safeMap(async (filter, multiple) => {
            // execute query
            const result = await $table.findRows({
                filters: [filter],
                limit: multiple ? null : 1,
            })

            // delist result if multiple isn't set
            return multiple ? result : delist(result)
        }, filters, multiple)

        this.publish({
            rows: delist(queryResult)
        })
    },
}