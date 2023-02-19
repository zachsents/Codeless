import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:GetField",
    name: "Column",

    inputs: ["rows"],
    outputs: ["field"],

    async onInputsReady({ rows }) {
        
        await safeMap(row => row.getField(this.state.field), rows)
            |> this.publish({ field: ^^})
    },
}