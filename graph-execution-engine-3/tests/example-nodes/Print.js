
/**
 * Cases this covers:
 *  - publishing on nonexistent outputs
 *  - not defining outputs property
 *  - shorthand array mode
 */

export default {
    id: "print",
    inputs: ["$"],
    // outputs: [],

    /** @this {import("../../Node.js").Node} */
    onInputsReady({ $ }) {
        console.log("printing", $)

        this.publish({ nonExistentOutput: "oops" })
    },
}