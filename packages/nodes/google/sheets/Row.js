

export default {
    id: "googlesheets:Row",
    name: "Row",
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