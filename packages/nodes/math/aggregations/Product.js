import { recurse } from "../../arrayUtilities.js"


export default {
    id: "math:Product",
    name: "Product",

    inputs: ["_in"],
    outputs: ["product"],
    
    onInputsReady({ _in }) {
        this.publish({ product: recurse(_in, product) })
    },
}


function product(list) {
    return list.reduce((accum, cur) => accum * cur, 1)
}