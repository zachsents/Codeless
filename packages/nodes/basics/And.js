import { recurse } from "../arrayUtilities.js"


export default {
    id: "basic:And",
    name: "And",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return recurse(
                        await this.in,
                        list => list.every(cond => !!cond)
                    )
                }
            }
        }
    }
}