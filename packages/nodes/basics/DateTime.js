

export default {
    id: "primitive:DateTime",
    name: "Date & Time",
    sources: {
        values: {
            " ": {
                get() {
                    return new Date(this.state.$)
                }
            }
        }
    }
}