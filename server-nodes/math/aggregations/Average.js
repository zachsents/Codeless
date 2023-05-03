

export default {
    id: "math:Average",

    inputs: ["list"],

    onInputsReady({ list }) {
        this.publish({
            result: average(list)
        })
    },
}


function average(list) {
    return list.reduce((acc, cur) => acc + cur, 0) / list.length
}