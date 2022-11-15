
export default {
    RandomNumber: {
        id: "RandomNumber",
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
    },
    Sum: {
        id: "Sum",
        name: "Sum",
        description: "Sums inputs together.",
        categories: ["Math"],
        targets: {
            values: {
                in: {}
            }
        },
        sources: {
            values: {
                sum: {
                    get() {
                        return this.in.reduce((accum, cur) => accum + cur, 0)
                    }
                }
            }
        },
    }
}