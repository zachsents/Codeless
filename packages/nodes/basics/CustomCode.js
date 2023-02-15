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
            this.state.inputLabels.map((label, i) => [
                label,
                input[i]?.length > 1 ? input[i] : input[i][0]
            ])
        )
        await jail.set("inputs", new ivm.ExternalCopy(inputs).copyInto())

        // set blank output object
        await jail.set("outputs", new ivm.ExternalCopy({}).copyInto())

        // compile & eval code
        const codeSnippet = await isolate.compileScript(this.state.code)
        await codeSnippet.run(context)

        // get outputs object
        const outputs = await (await jail.get("outputs")).copy()

        this.publish(
            Object.fromEntries(
                this.state.outputLabels.map(
                    (label, i) => [`output.${i}`, outputs[label]]
                )
            )
        )

        isolate.dispose()
    },
}