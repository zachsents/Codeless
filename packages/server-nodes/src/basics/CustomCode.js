import ivm from "isolated-vm"


export default {
    id: "basic:CustomCode",
    name: "Custom Code",

    inputs: ["input"],
    outputs: ["output"],


    async onInputsReady({ input }) {

        // set up isolate & context
        const isolate = new ivm.Isolate({ memoryLimit: 128 })
        const context = await isolate.createContext()
        const jail = context.global

        // set inputs
        const inputs = Object.fromEntries(
            input.map(input => {
                const arr = input.map(inp => inp.value)
                return [input._label, arr.length == 1 ? arr[0] : []]
            })
        )
        await jail.set("inputs", new ivm.ExternalCopy(inputs).copyInto())

        // set blank output object
        await jail.set("outputs", new ivm.ExternalCopy({}).copyInto())

        // compile & eval code
        const codeSnippet = await isolate.compileScript(this.state.code)
        await codeSnippet.run(context)

        // get outputs object
        const outputs = await (await jail.get("outputs")).copy()

        // transform outputs into something we can publish
        Object.keys(outputs).forEach(key => {
            const id = this.state._outputLabels.find(label => label.value == key)?.id

            if (id)
                outputs[`output.${id}`] = outputs[key]

            delete outputs[key]
        })

        this.publish(outputs)

        isolate.dispose()
    },
}