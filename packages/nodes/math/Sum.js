import { recurse } from "../arrayUtilities.js"

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
                    return recurse(await this.in, sum)
                }
            }
        }
    },
}

function sum(list) {
    return list.reduce((accum, cur) => accum + cur, 0)
}