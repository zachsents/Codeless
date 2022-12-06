import { delist } from "../arrayUtilities.js"


export default {
    id: "object:WriteProperty",
    name: "Write Property",
    targets: {
        values: {
            object: {},
            value: {},
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return delist(
                        (await this.object)
                            .map(async obj => ({
                                ...obj,
                                [this.state.$]: delist(await this.value),
                            }))
                    )
                }
            }
        }
    }
}