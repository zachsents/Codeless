

export default {
    id: "tables:GetAllRows",

    inputs: ["$table"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-sdk/airtable/airtable.js").Table | 
     *  import("@minus/server-sdk/google/sheets.js").Table} inputs.$table
     */
    async onInputsReady({ $table }) {
        this.publish({
            rows: await $table.findRows({
                filters: [true],
            })
        })
    },
}