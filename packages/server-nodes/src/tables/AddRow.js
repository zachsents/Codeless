import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:AddRow",
    name: "Add Row",

    inputs: ["$table", "data"],
    outputs: ["newRow"],

    async onInputsReady({ $table, data }) {
        // map to records
        safeMap((...data) => {
            return data.map((item, i) => [this.state.dataLabels[i] ?? i, item])
                |> Object.fromEntries(^^)
        }, ...data)
            // add rows to table
            |> await $table.addRows(^^)
            // output newly added rows
            |> this.publish({ newRow: ^^ })
    },
}