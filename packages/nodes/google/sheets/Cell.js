

export default {
    id: "googlesheets:Cell",
    name: "Cell",
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