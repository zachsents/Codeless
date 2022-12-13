

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
                    await this["  "](x)
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