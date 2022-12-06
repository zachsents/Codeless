import { delist } from "../arrayUtilities.js"


export default {
    id: "object:ReadProperty",
    name: "Read Property",
    targets: {
        values: {
            object: {}
        }
    },
    sources: {
        values: {
            property: {
                async get() {
                    return delist((await this.object).map(obj => obj[this.state.$]))
                }
            }
        }
    }
}