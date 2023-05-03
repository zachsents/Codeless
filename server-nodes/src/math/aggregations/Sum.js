

export default {
    id: "math:Sum",

    inputs: ["list"],

    onInputsReady({ list }) {
        this.publish({
            result: sum(list)
        })
    },
}


function sum(list) {
    return list.reduce((accum, cur) => accum + cur, 0)
}