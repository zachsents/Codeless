

export default {
    id: "utility:Bind",
    name: "Bind",
    targets: {
        values: {
            value: {}
        },
        signals: {
            signal: {
                action() {
                    this.out(this.value)
                }
            }
        }
    },
    sources: {
        signals: {
            out: {}
        }
    },
}