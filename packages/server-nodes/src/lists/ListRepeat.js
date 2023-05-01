import { safeMap } from "../arrayUtilities.js"

export default {
    id: "basic:ListRepeat",
    name: "Repeat",

    inputs: ["value", "count"],
    outputs: ["list"],


    onInputsReady({ value, count }) {
        this.publish({
            list: safeMap((value, count) => Array(count).fill(value), value, count)
        })
    },
}