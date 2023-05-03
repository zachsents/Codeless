import { ArrayMode } from "../../ArrayMode.js"

/**
 * Cases this covers:
 *  - longhand array mode
 *  - long-running calculation
 */

export default {
    id: "power",
    inputs: [
        "base",
        {
            name: "power",
            arrayMode: ArrayMode.FlatSingle,
        }
    ],
    outputs: ["result"],

    /** @this {import("../../Node.js").Node} */
    async onInputsReady({ base, power }) {

        await new Promise(res => setTimeout(res, 1000))
        
        this.publish({
            result: base?.map(b => Math.pow(b, power))
        })
    },
}