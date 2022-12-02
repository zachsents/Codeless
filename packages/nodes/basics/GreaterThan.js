

export default {
    id: "basic:GreaterThan",
    name: "Greater Than",
    targets: {
        values: {
            a: {},
            b: {},
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    const aList = await this.a
                    const bList = await this.b

                    return bList.length == 1 ?
                        aList.map(a => a > bList[0]) :
                        aList.map((a, i) => a > bList[i])
                }
            }
        }
    }
}