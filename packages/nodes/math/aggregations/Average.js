import { recurse } from "../../arrayUtilities.js"


export default {
    id: "math:Average",
    name: "Average",

    inputs: ["_in"],
    outputs: ["average"],
    
    onInputsReady({ _in }) {
        this.publish({ average: recurse(_in, average) })
    },
}


function average(list) {
    return list.reduce((accum, cur) => accum + cur, 0) / list.length
}