import { elementWise } from "../arrayUtilities.js"


export default {
    id: "basic:GreaterThan",
    name: "Greater Than",
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
                        (a, b) => a > b
                    )
                }
            }
        }
    }
}