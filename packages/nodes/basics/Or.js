

export default {
    id: "basic:Or",
    name: "Or",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return (await this.in).some(cond => !!cond)
                }
            }
        }
    }
}