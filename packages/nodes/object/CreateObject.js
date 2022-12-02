

export default {
    id: "object:CreateObject",
    name: "Create Object",
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