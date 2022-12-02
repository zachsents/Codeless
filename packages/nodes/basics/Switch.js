

export default {
    id: "primitive:Switch",
    name: "Switch",
    sources: {
        values: {
            " ": {
                async get() {
                    return this.state.$
                }
            }
        }
    }
}