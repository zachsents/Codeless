
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
                    return this.in?.deepFlat().reduce((accum, cur) => accum * cur, 1)
                }
            }
        }
    },
}