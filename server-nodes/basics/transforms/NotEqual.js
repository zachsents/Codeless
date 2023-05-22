import { Operation } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:NotEqual",

    inputs: ["input"],

    onInputsReady({ input }) {
        this.publish({
            result: safeMap(Operation.NotEqual, ...input),
        })
    },
}