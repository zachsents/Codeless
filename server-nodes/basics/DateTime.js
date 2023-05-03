import { ArrayMode } from "@minus/gee3"


export default {
    id: "basic:DateTime",

    inputs: [
        {
            name: "internalDate",
            arrayMode: ArrayMode.FlatSingle,
        }
    ],

    onInputsReady({ internalDate }) {
        this.publish({ $: new Date(internalDate) })
    },
}