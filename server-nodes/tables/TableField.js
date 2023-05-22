import { TableField } from "@minus/server-lib"


export default {
    id: "tables:TableField",

    inputs: ["$field"],

    onInputsReady({ $field }) {
        this.publish({ $: new TableField($field) })
    },
}