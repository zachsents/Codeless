import { recurse } from "../arrayUtilities.js"

export default {
    id: "math:Product",
    name: "Product",
    targets: {
        values: {
            in: {},
        }
    },
    sources: {
        values: {
            product: {
                async get() {
                    return recurse(await this.in, product)
                }
            }
        }
    },
}

function product(list) {
    return list.reduce((accum, cur) => accum * cur, 1)
}