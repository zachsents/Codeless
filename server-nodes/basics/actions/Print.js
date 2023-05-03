import { ArrayMode } from "@minus/gee3"
import chalk from "chalk"


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
        console.log()
        line()
        console.log(chalk.yellow("Print Node"))
        line()
        console.debug(chalk.gray(`type: ${_in?.constructor?.name} (${typeof _in})`))
        console.log(_in)
        line()
        console.log()

        // return to flow
        this.graph.return("logs", _in)
    },
}

function line() {
    console.log(chalk.gray('-'.repeat(process.stdout.columns ?? 20)))
}