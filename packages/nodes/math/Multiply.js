
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
                async get() {
                    return (await this.in)?.deepFlat().reduce((accum, cur) => accum * cur, 1)
                }
            }
        }
    },
}