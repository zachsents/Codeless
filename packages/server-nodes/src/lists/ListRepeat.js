
export default {
    id: "lists:ListRepeat",

    inputs: ["$value", "$count"],

    onInputsReady({ $value, $count }) {
        this.publish({
            list: Array($count).fill($value),
        })
    },
}