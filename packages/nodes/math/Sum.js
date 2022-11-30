
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
                async get() {
                    return (await this.in)?.deepFlat().reduce((accum, cur) => accum + cur, 0)
                }
            }
        }
    },
}