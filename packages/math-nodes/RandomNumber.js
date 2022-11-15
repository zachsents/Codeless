
export default {
    id: "math:RandomNumber",
    name: "Random Number",
    description: "Generates a random number.",
    categories: ["Math"],
    sources: {
        values: {
            " ": {
                get: () => Math.random()
            }
        }
    }
}