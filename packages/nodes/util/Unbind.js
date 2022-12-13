

export default {
    id: "utility:Unbind",
    name: "Unbind",
    targets: {
        signals: {
            signal: {
                async action(x) {
                    this.state.$ = x
                    await this.out()
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