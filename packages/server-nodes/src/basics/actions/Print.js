

export default {
    id: "basic:Print",
    name: "Print",

    inputs: ["_in"],
    outputs: [],

    onInputsReady({ _in }) {
        const printContent = _in.length == 1 ? _in[0] : _in

        // print to console
        console.log("\n")
        line()
        console.log("Print Node")
        line()
        console.log(printContent)
        line()

        // return to flow
        this.graph.return("logs", printContent)
    },
}

function line() {
    console.log('-'.repeat(process.stdout.columns ?? 20))
}