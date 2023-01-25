import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:SetColumn",
    name: "Set Column",

    inputs: ["table", "value"],
    outputs: ["tableOut"],

    async onInputsReady({ table, value }) {

        const columnName = this.state.column

        await Promise.all(
            safeMap(
                (tab, val) => tab.setColumn(columnName, val),
                table, value
            )
        )

        this.publish({ tableOut: table })
    },
}