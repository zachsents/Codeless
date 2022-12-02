

export default {
    id: "basic:Not",
    name: "Not",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return (await this.in).map(cond => !cond)
                }
            }
        }
    }
}