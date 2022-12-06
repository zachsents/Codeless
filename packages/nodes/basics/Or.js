import { recurse } from "../arrayUtilities.js"


export default {
    id: "basic:Or",
    name: "Or",
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
                        list => list.some(cond => !!cond)
                    )
                }
            }
        }
    }
}