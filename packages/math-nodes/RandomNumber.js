
export default {
    id: "math:RandomNumber",
    name: "Random Number",
    sources: {
        values: {
            " ": {
                get() {
                    const rand = Math.random() * (this.state.max - this.state.min) + this.state.min
                    return this.state.integer ? Math.floor(rand) : rand
                }
            }
        }
    }
}