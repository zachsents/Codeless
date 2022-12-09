import { recurse } from "../arrayUtilities.js"

export default {
    id: "list:Size",
    name: "Size",
    targets: {
        values: {
            " ": {}
        }
    },
    sources: {
        values: {
            size: {
                async get() {
                    return recurse(await this[" "], list => list.length)
                }
            }
        }
    },
}