
/**
 * Cases this covers:
 *  - shorthand array mode
 *  - list handle
 */

export default {
    id: "write-equation",
    inputs: ["$nums"],
    outputs: ["equation"],

    /** @this {import("../../Node.js").Node} */
    onInputsReady({ $nums }) {
        this.publish({
            equation: `${$nums.join(" + ")} = ${$nums.reduce((sum, cur) => sum + cur, 0)}`
        })
    },
}