

const compareFns = {
    "equal": (b) => (a) => a == b,
    "notEqual": (b) => (a) => a != b,
    "gt": (b) => (a) => a > b,
    "gte": (b) => (a) => a >= b,
    "lt": (b) => (a) => a < b,
    "lte": (b) => (a) => a <= b,
    "equalIgnoreCase": (b) => (a) => a.toLowerCase() == b.toLowerCase(),
    "contains": (b) => (a) => a.includes(b),
    "notcontains": (b) => (a) => !a.includes(b),
    "startsWith": (b) => (a) => a.startsWith(b),
    "endsWith": (b) => (a) => a.endsWith(b),
}


export default {
    id: "googlesheets:Filter",

    inputs: ["$column", "$operator", "$value"],

    onInputsReady({ $column, $operator, $value }) {

        // Validate
        if (!$column) throw new Error("Must provide a column")

        this.publish({
            filter: {
                column: $column,
                compareFn: compareFns[$operator]($value),
            }
        })
    },
}
