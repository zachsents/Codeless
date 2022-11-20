
export default {
    id: "math:Multiply",
    name: "Multiply",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            product: {
                get() {
                    return this.in.reduce((accum, cur) => accum * cur, 1)
                }
            }
        }
    },
}