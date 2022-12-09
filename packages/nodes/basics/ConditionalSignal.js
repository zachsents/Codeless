
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
                    (await this.condition).forEach(cond => {
                        if(!!cond) 
                            this.a(x)
                        else
                            this.b(x)
                    })
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