import { TableField } from "@minus/server-sdk"


export default {
    id: "tables:TableField",

    inputs: ["$field"],

    onInputsReady({ $field }) {
        this.publish({ $: new TableField($field) })
    },
}