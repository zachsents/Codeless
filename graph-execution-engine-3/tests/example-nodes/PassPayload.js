
/**
 * Cases this covers:
 *  - setup payload
 *  - not defining inputs property
 *  - instant starter
 */

export default {
    id: "pass-payload",
    outputs: ["result"],

    /** @this {import("../../Node.js").Node} */
    onStart(setupPayload) {
        this.publish({ result: setupPayload })
    },
}