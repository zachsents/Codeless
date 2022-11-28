

export default {
    id: "primitive:Number",
    name: "Number",
    sources: {
        values: {
            " ": {
                get() {
                    return this.state.$
                }
            }
        }
    }
}