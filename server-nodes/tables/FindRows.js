import { delist, safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:FindRows",

    inputs: ["$table", "filters", "limit"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-lib/airtable/index.js").Table | 
     *  import("@minus/server-lib/google").sheets.Table} inputs.$table
     * @param {Operation[]} inputs.filters
     */
    async onInputsReady({ $table, filters, limit }) {

        // execute query
        const queryResult = await safeMap((filter, limit) => $table.findRows({
            filters: [filter],
            limit,
        }), filters, limit)

        this.publish({
            rows: delist(queryResult)
        })
    },
}