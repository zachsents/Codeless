

export default {
    id: "primitive:Text",
    name: "Text",
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