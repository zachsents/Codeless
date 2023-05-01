import { ArrayMode } from "@minus/gee3"


export default {
    id: "basic:Print",

    inputs: [
        {
            name: "_in",
            arrayMode: ArrayMode.FlatPreferSingle,
        },
    ],

    onInputsReady({ _in }) {
        // print to console
        console.log("\n")
        line()
        console.log("Print Node")
        line()
        console.log(_in)
        line()

        // return to flow
        this.graph.return("logs", _in)
    },
}

function line() {
    console.log('-'.repeat(process.stdout.columns ?? 20))
}