import { recurse } from "../../arrayUtilities.js"


export default {
    id: "math:Sum",
    name: "Sum",

    inputs: ["_in"],
    outputs: ["sum"],
    
    onInputsReady({ _in }) {
        this.publish({ sum: recurse(_in, sum) })
    },
}


function sum(list) {
    return list.reduce((accum, cur) => accum + cur, 0)
}