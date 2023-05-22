

export default {
    id: "tables:GetAllRows",

    inputs: ["$table"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-lib/airtable/index.js").Table | 
     *  import("@minus/server-lib/google").sheets.Table} inputs.$table
     */
    async onInputsReady({ $table }) {
        this.publish({
            rows: await $table.findRows({
                filters: [true],
            })
        })
    },
}