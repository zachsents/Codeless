
export default {
    id: "math:Average",
    name: "Average",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            average: {
                async get() {
                    const flat = (await this.in)?.deepFlat()
                    return flat.reduce((accum, cur) => accum + cur, 0) / flat.length
                }
            }
        }
    },
}