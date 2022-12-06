
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
                    const inputs = await this.in
                    const twoDimensional = inputs.every(el => el?.map)
                    
                    return twoDimensional ? inputs.map(multiply) : multiply(inputs)
                }
            }
        }
    },
}

function multiply(list) {
    return list.reduce((accum, cur) => accum * cur, 1)
}