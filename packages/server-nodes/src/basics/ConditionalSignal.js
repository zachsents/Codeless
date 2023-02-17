
export default {
    id: "basic:ConditionalSignal",
    name: "Conditional Signal",
    targets: {
        values: {
            condition: {},
        },
        signals: {
            in: {
                async action(x) {
                    await Promise.all(
                        (await this.condition).map(
                            async cond => !!cond ? this.a(x) : this.b(x)
                        )
                    )
                }
            }
        }
    },
    sources: {
        signals: {
            a: {},
            b: {},
        }
    }
}