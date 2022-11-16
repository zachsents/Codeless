
export default {
    id: "math:Sum",
    name: "Sum",
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