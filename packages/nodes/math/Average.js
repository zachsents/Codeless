
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
                    const inputs = await this.in
                    const twoDimensional = inputs.every(el => el?.map)

                    return twoDimensional ? inputs.map(average) : average(inputs)
                }
            }
        }
    },
}

function average(list) {
    return list.reduce((accum, cur) => accum + cur, 0) / list.length
}