import { recurse } from "../arrayUtilities.js"

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
                    return recurse(await this.in, average)
                }
            }
        }
    },
}

function average(list) {
    return list.reduce((accum, cur) => accum + cur, 0) / list.length
}