
/**
 * Cases this covers:
 *  - throwing errors
 */

export default {
    id: "error",
    inputs: ["$"],
    outputs: ["result"],

    /** @this {import("../../Node.js").Node} */
    onInputsReady() {
        throw new Error("Error was thrown")
    },
}