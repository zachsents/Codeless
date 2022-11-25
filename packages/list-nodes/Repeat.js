

export default {
    id: "list:Repeat",
    name: "Repeat",
    targets: {
        values: {
            in: {},
            count: {},
        }
    },
    sources: {
        values: {
            list: {
                get() {
                    return Array(this.count?.[0] ?? 1).fill(0).map(() => this.in.untype())
                }
            }
        }
    }
}