

export default {
    id: "utility:Bind",
    name: "Bind",
    targets: {
        values: {
            value: {}
        },
        signals: {
            signal: {
                async action() {
                    await this.out(await this.value)
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