
export default {
    id: "math:RandomNumber",
    name: "Random Number",
    sources: {
        values: {
            " ": {
                get: () => Math.random()
            }
        }
    }
}