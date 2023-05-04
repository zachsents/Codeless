import { ArrayMode } from "@minus/gee3"


export default {
    id: "basic:ReturnFromFlow",

    inputs: [
        {
            name: "data",
            arrayMode: ArrayMode.FlatPreferSingle,
        },
    ],

    onInputsReady({ data }) {
        this.graph.return("data", data)
    },
}