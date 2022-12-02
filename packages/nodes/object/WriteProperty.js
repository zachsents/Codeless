

export default {
    id: "object:WriteProperty",
    name: "Write Property",
    targets: {
        values: {
            object: {},
            value: {},
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return (await this.object).map(async obj => ({
                        ...obj,
                        [this.state.$]: (await this.value).untype(),
                    })).untype()
                }
            }
        }
    }
}