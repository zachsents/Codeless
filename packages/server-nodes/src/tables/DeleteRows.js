

export default {
    id: "tables:DeleteRows",
    name: "Delete Rows",

    inputs: ["rows"],
    outputs: [],

    async onInputsReady({ rows }) {

        if (rows.length == 0)
            return

        const table = rows[0].table

        if (!rows.every(row => row.table == table))
            throw new Error("All rows must be from the same table")

        await table.deleteRows(rows)
    },
}