
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
                    const inputs = await this.in
                    const twoDimensional = inputs.every(el => el?.map)
                    
                    return twoDimensional ? inputs.map(sum) : sum(inputs)
                }
            }
        }
    },
}

function sum(list) {
    return list.reduce((accum, cur) => accum + cur, 0)
}