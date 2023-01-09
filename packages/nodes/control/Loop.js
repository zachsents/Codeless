

export default {
    id: "control:Loop",
    name: "Loop",

    inputs: ["$ex", "times"],
    outputs: ["$"],

    onInputsReady({ $ex, times }) {
        for (let i = 0; i < times; i++)
            this.publish({ $: $ex })
    },
}
