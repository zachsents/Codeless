import { delist } from "../arrayUtilities.js"


export default {
    id: "list:Repeat",
    name: "Repeat",
    targets: {
        values: {
            in: {},
            count: {},
        }
    },
    sources: {
        values: {
            list: {
                async get() {
                    return Promise.all(
                        Array((await this.count)?.[0] ?? 1)
                            .fill(0)
                            .map(async () => delist(await this.in))
                    )
                }
            }
        }
    }
}