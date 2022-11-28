
export default {
    id: "utility:Memo",
    name: "Memo",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                get() {
                    if(this.state.$ === undefined)
                        this.state.$ = this.in

                    return this.state.$
                }
            }
        }
    },
}