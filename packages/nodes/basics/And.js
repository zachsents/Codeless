import { recurse } from "../arrayUtilities.js"


export default {
    id: "basic:And",
    name: "And",

    inputs: ["conditions"],
    outputs: ["$"],

    onInputsReady({ conditions }) {
        this.publish({
            $: recurse(conditions, list => list.every(cond => !!cond))
        })
    },
}