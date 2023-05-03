import { Operation } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "math:Add",

    inputs: ["input"],

    onInputsReady({ input }) {
        this.publish({
            result: safeMap(Operation.Add, ...input),
        })
    },
}