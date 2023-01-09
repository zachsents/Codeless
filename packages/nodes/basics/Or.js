

export default {
    id: "basic:Or",
    name: "Or",

    inputs: ["$condition"],
    outputs: ["$"],

    onInputsReady({ $condition }) {
        $condition.setElementWisePredicate((a, b) => a || b)        
        this.publish({ $: $condition })
    },
}