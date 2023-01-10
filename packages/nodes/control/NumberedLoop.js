

export default {
    id: "control:NumberedLoop",
    name: "Numbered Loop",

    inputs: ["$ex", "times"],
    outputs: ["$"],

    onInputsReady({ $ex, times }) {
        for (let i = 0; i < times; i++)
            this.publish({ $: $ex })
    },
}
