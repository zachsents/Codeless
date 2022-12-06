

export default {
    id: "googlesheets:Column",
    name: "Column",
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