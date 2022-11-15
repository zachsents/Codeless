
export default {
    id: "math:Sum",
    name: "Sum",
    description: "Sums inputs together.",
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