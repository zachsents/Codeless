

export function BasicPredicate(operation) {
    return {
        inputs: ["$condition"],
        outputs: ["$"],

        onInputsReady({ $condition }) {
            $condition.setElementWisePredicate(operation)
            this.publish({ $: $condition })
        },
    }
}