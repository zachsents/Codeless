import { ArrayMode } from "@minus/gee3"

export default {
    id: "basic:SetVariable",

    inputs: [
        {
            name: "name",
            arrayMode: ArrayMode.FlatSingle,
        },
        {
            name: "value",
            arrayMode: ArrayMode.FlatPreferSingle,
        },
    ],

    onInputsReady({ name, value }) {
        this.graph.setVariable(name, value)
    },
}