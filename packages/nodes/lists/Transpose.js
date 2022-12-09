import _ from "lodash"
import { isDeeper } from "../arrayUtilities.js"

export default {
    id: "list:Transpose",
    name: "Transpose",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    const input = await this.in
                    return isDeeper(input) ? _.zip(...input) : input
                }
            }
        }
    },
}