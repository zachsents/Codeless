

export default {
    id: "utility:Unbind",
    name: "Unbind",
    targets: {
        signals: {
            signal: {
                action(x) {
                    this.state.$ = x
                    this.out()
                }
            }
        },
    },
    sources: {
        values: {
            value: {
                get() {
                    return this.state.$
                }
            }
        },
        signals: {
            out: {}
        }
    },
}