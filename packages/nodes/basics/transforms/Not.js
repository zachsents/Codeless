

export default {
    id: "basic:Not",
    name: "Not",

    inputs: ["_in"],
    outputs: ["_out"],

    onInputsReady({ _in }) {
        this.publish({ _out: _in.map(input => !input) })
    },
}