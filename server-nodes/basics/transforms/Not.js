import { Operation } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:Not",

    inputs: ["input"],

    onInputsReady({ input }) {
        this.publish({
            result: safeMap(Operation.Not, input),
        })
    },
}