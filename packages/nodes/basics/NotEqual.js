import { elementWise } from "../arrayUtilities.js"


export default {
    id: "basic:NotEqual",
    name: "Not Equal",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return elementWise(
                        await this.a,
                        await this.b,
                        (a, b) => a != b
                    )
                }
            }
        }
    }
}