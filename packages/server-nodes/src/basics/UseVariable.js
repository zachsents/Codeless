import { ArrayMode } from "@minus/gee3"


export default {
    id: "basic:UseVariable",

    inputs: [
        {
            name: "name",
            arrayMode: ArrayMode.FlatSingle,
        }
    ],

    onBeforeStart() {
        this.graph.subscribeToVariable(this.getInputValue("name"), value => {
            this.publish({ value })
        })
    },
}

