

export default {
    id: "basic:NotEqual",
    name: "Not Equal",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    const aList = await this.a
                    const bList = await this.b

                    return bList.length == 1 ?
                        aList.map(a => a != bList[0]) :
                        aList.map((a, i) => a != bList[i])
                }
            }
        }
    }
}