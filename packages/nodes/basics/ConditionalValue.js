import { delist } from "../arrayUtilities.js"


export default {
    id: "basic:ConditionalValue",
    name: "Conditional Value",
    targets: {
        values: {
            condition: {},
            a: {},
            b: {},
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    const a = delist(await this.a)
                    const b = delist(await this.b)
                    return (await this.condition).map(cond => !!cond ? a : b)
                }
            }
        }
    }
}