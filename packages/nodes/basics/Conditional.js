

export default {
    id: "basic:Conditional",
    name: "Conditional",
    targets: {
        values: {
            condition: {},
            a: {},
            b: {},
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    const a = (await this.a).untype()
                    const b = (await this.b).untype()
                    return (await this.condition).map(cond => !!cond ? a : b)
                }
            }
        }
    }
}