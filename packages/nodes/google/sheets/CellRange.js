

export default {
    id: "googlesheets:CellRange",
    name: "Cell Range",
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