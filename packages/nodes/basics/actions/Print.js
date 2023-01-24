

export default {
    id: "basic:Print",
    name: "Print",

    inputs: ["_in"],
    outputs: [],

    onInputsReady({ _in }) {
        console.log("\n")
        line()
        console.log("Print Node")
        line()
        console.log(
            _in.length == 1 ? _in[0] : _in
        )
        line()
    },
}

function line() {
    console.log('-'.repeat(process.stdout.columns ?? 20))
}