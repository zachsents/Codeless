

export default {
    id: "googlesheets:ColumnRange",
    name: "Column Range",
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