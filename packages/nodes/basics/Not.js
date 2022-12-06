import { recurse } from "../arrayUtilities.js"


export default {
    id: "basic:Not",
    name: "Not",
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
                        list => list.map(cond => !cond)
                    )
                }
            }
        }
    }
}