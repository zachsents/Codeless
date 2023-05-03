import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:GetField",

    inputs: ["rows", "field"],

    async onInputsReady({ rows, field }) {
        this.publish({
            data: await safeMap(
                (row, field) => row.getField(field),
                rows, field
            )
        })
    },
}