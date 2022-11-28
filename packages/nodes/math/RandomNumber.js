
export default {
    id: "math:RandomNumber",
    name: "Random Number",
    sources: {
        values: {
            " ": {
                get() {
                    const rand = Math.random() * (this.state.max + (this.state.integer ? 1 : 0) - this.state.min) + this.state.min
                    return this.state.integer ? Math.floor(rand) : rand
                }
            }
        }
    }
}