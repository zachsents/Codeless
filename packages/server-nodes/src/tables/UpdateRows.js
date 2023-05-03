import { objectToSafeMapEntries, safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:UpdateRows",

    inputs: ["rows", "data"],

    async onInputsReady({ rows, data }) {

        if (rows.length == 0)
            return this.publish({ updatedRows: [] })

        const table = rows[0].table

        if (!rows.every(row => row.table == table))
            throw new Error("All rows must be from the same table")

        // map to update objects
        const updates = safeMap(
            (row, data) => ({ row, data }),
            rows, objectToSafeMapEntries(data)
        )

        this.publish({
            updatedRows: await table.updateRows(updates)
        })
    },
}