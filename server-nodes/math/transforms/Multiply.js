import { Operation } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "math:Multiply",

    inputs: ["input"],

    onInputsReady({ input }) {
        this.publish({
            result: safeMap(Operation.Multiply, ...input),
        })
    },
}