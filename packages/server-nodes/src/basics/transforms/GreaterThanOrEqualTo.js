import { Operation } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:GreaterThanOrEqualTo",

    inputs: ["input"],

    onInputsReady({ input }) {
        this.publish({
            result: safeMap(Operation.GreaterThanOrEqualTo, ...input),
        })
    },
}