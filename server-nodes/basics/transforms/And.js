import { Operation } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:And",

    inputs: ["input"],

    onInputsReady({ input }) {
        this.publish({
            result: safeMap(Operation.And, ...input),
        })
    },
}