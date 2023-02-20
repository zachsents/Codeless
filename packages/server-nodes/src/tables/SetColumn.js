import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:SetColumn",
    name: "Set Column",

    inputs: ["table", "value"],
    outputs: ["tableOut"],

    async onInputsReady({ table, value }) {

        await safeMap(
            (row, val) => row.setColumn(this.state.column, val),
            table, value
        )

        this.publish({ tableOut: table })
    },
}