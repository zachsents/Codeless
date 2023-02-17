import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:GreaterThan",
    name: "Greater Than",

    inputs: ["_a", "_b"],
    outputs: ["$"],

    onInputsReady({ _a, _b }) {
        this.publish({
            $: safeMap((a, b) => parseFloat(a) > parseFloat(b), _a, _b)
        })
    },
}