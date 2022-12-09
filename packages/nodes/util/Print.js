

export default {
    id: "utility:Print",
    name: "Print",
    targets: {
        values: {
            value: {},
        },
        signals: {
            " ": {
                async action(x) {
                    console.log(await this.value)
                    this["  "](x)
                }
            }
        }
    },
    sources: {
        signals: {
            "  ": {}
        }
    }
}