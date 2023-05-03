
/**
 * Cases this covers:
 *  - multiple publishes
 */

export default {
    id: "looper",
    inputs: [],
    outputs: ["$"],

    /** @this {import("../../Node.js").Node} */
    onStart() {
        for (let i = 100; i < 140; i += 10)
            this.publish({ $: i })
    },
}