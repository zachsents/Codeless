import ivm from "isolated-vm"
import { ArrayMode } from "@minus/gee3"


export default {
    id: "basic:CustomCode",

    inputs: [
        {
            name: "input",
            arrayMode: ArrayMode.FlatPreferSingle,
        },
        {
            name: "code",
            arrayMode: ArrayMode.FlatSingle,
        },
    ],

    async onInputsReady({ input, code }) {

        // set up isolate & context
        const isolate = new ivm.Isolate({ memoryLimit: 128 })
        const context = await isolate.createContext()
        const jail = context.global

        // set inputs
        await jail.set("inputs", new ivm.ExternalCopy(input).copyInto())

        // set blank output object
        await jail.set("outputs", new ivm.ExternalCopy({}).copyInto())

        // compile & eval code
        const codeSnippet = await isolate.compileScript(code)
        await codeSnippet.run(context)

        // get outputs object
        const outputs = await (await jail.get("outputs")).copy()

        this.publish({
            output: outputs,
        })

        isolate.dispose()
    },
}