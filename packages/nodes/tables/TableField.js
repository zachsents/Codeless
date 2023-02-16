import { TableField } from "@minus/server-sdk"

export default {
    id: "tables:TableField",
    name: "Table Field",

    inputs: [],
    outputs: ["$"],

    onStart() {
        this.publish({ $: new TableField(this.state.field) })
    },
}