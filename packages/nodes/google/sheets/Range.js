

export default {
    id: "googlesheets:Range",
    name: "Range",
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