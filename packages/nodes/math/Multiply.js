import { recurse } from "../arrayUtilities.js"

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
                    return recurse(await this.in, multiply)
                }
            }
        }
    },
}

function multiply(list) {
    return list.reduce((accum, cur) => accum * cur, 1)
}