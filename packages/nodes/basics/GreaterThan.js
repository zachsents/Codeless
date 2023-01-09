

export default {
    id: "basic:GreaterThan",
    name: "Greater Than",

    inputs: ["$condition"],
    outputs: ["$"],

    onInputsReady({ $condition }) {
        $condition.setElementWisePredicate((a, b) => a > b)        
        this.publish({ $: $condition })
    },
}