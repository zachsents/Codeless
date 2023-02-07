import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:Not",
    name: "Not",

    inputs: ["_in"],
    outputs: ["_out"],

    onInputsReady({ _in }) {
        this.publish({ _out: safeMap(input => !input, _in) })
    },
}