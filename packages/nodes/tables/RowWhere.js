import { sheets } from "@minus/server-sdk"


export default {
    id: "tables:RowWhere",
    name: "Row Where",

    inputs: ["$table", "$searchValue"],
    outputs: ["row"],

    /**
     * @param {object} inputs
     * @param {sheets.Table} inputs.$table
     * @param {*} inputs.$searchValue
     */
    async onInputsReady({ $table, $searchValue }) {

        if(!this.state.searchColumn)
            throw new Error("Must specify search column")

        // set up filter
        const filterFunc = sheets.FieldFilter[this.state.compareMethod]?.($searchValue)
        if(!filterFunc)
            throw new Error("Invalid filter function")

        const filter = new sheets.FieldFilter(this.state.searchColumn, filterFunc)

        // execute query
        const rows = await $table.findRows({
            filter,
            limit: this.state.multiple ? undefined : 1,
        })

        this.publish({ row: rows })
    },
}