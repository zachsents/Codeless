import { elementWise } from "../arrayUtilities.js"


export default {
    id: "math:Add",
    name: "Add",
    targets: {
        values: {
            a: {},
            b: {},
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return elementWise(
                        await this.a,
                        await this.b,
                        (a, b) => a + b
                    )
                }
            }
        }
    }
}