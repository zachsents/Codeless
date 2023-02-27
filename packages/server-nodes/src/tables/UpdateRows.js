import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:UpdateRows",
    name: "Update Rows",

    inputs: ["rows", "data"],
    outputs: ["updatedRows"],

    async onInputsReady({ rows, data }) {

        if (rows.length == 0)
            return this.publish({ updateRows: [] })

        const table = rows[0].table

        if (!rows.every(row => row.table == table))
            throw new Error("All rows must be from the same table")

        // map to update objects
        safeMap((row, ...data) => ({
            row,
            data: data.map((item, i) => [item.label || i, item.value])
                |> Object.fromEntries(^^)
        }), rows, ...data)
            // make the updates
            |> await table.updateRows(^^)
            // output newly added rows
            |> this.publish({ updatedRows: ^^ })
    },
}