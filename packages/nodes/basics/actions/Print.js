

export default {
    id: "basic:Print",
    name: "Print",

    inputs: ["$in"],
    outputs: [],

    onInputsReady({ $in }) {
        console.log("\n")
        line()
        console.log("Print Node")
        line()
        console.log($in)
        line()
    },
}

function line() {
    console.log('-'.repeat(process.stdout.columns ?? 20))
}