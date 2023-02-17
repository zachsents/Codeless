
export default {
    id: "math:RandomNumber",
    name: "Random Number",

    inputs: [],
    outputs: ["$"],

    onStart() {
        const rand = Math.random() * (this.state.max + (this.state.integer ? 1 : 0) - this.state.min) + this.state.min
        this.publish({ $: this.state.integer ? Math.floor(rand) : rand })
    },
}