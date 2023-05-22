import { Operation } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "math:Subtract",

    inputs: ["input"],

    onInputsReady({ input }) {
        this.publish({
            result: safeMap(Operation.Subtract, ...input),
        })
    },
}