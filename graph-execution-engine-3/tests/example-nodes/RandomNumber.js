
/**
 * Cases this covers:
 *  - instant starter
 */

export default {
    id: "random-number",
    inputs: [],
    outputs: ["$"],

    /** @this {import("../../Node.js").Node} */
    onStart() {
        const rand = Math.random() * (this.state.max + (this.state.integer ? 1 : 0) - this.state.min) + this.state.min
        this.publish({
            $: this.state.integer ? Math.floor(rand) : rand
        })
    },
}
