

export default {
    id: "basic:And",
    name: "And",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return (await this.in).every(cond => !!cond)
                }
            }
        }
    }
}