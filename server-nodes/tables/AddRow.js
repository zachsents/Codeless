import { unzipObject } from "../arrayUtilities.js"


export default {
    id: "tables:AddRow",

    inputs: ["$table", "data"],

    async onInputsReady({ $table, data }) {

        if (!$table)
            throw new Error("Connect a table!")

        this.publish({
            newRow: await $table.addRows(
                unzipObject(data)
            )
        })
    },
}