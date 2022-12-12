import { elementWise } from "../arrayUtilities.js"

export default {
    id: "math:Multiply",
    name: "Multiply",
    targets: {
        values: {
            a: {},
            b: {},
        }
    },
    sources: {
        values: {
            product: {
                async get() {
                    return elementWise(
                        await this.a,
                        await this.b,
                        (a, b) => a * b
                    )
                }
            }
        }
    },
}
