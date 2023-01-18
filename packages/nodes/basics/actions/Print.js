

export default {
    id: "basic:Print",
    name: "Print",

    inputs: ["_in"],
    outputs: [],

    onInputsReady({ _in }) {
        console.log(_in)
    },
}