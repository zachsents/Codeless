import { sheets, airtable, Condition } from "@minus/server-sdk"
import { deepFlat } from "../arrayUtilities.js"


export default {
    id: "tables:FindRows",
    name: "Row Where",

    inputs: ["$table", "filters"],
    outputs: ["row"],

    /**
     * @param {object} inputs
     * @param {sheets.Table | airtable.Table} inputs.$table
     * @param {Condition[]} inputs.filters
     */
    async onInputsReady({ $table, filters }) {

        // execute query
        const rows = await $table.findRows({
            // make sure filters are flat and all Conditions
            filters: Condition.wrapPrimitives(deepFlat(filters)),
            limit: this.state.limit,
        })

        this.publish({ row: rows })
    },
}