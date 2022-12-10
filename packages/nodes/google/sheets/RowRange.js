

export default {
    id: "googlesheets:RowRange",
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