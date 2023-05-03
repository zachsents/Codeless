

export default {
    id: "math:Product",

    inputs: ["list"],

    onInputsReady({ list }) {
        this.publish({
            result: product(list)
        })
    },
}


function product(list) {
    return list.reduce((accum, cur) => accum * cur, 1)
}