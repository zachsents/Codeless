
export default {
    id: "list:FilterBlanks",
    name: "Filter Blanks",
    targets: {
        values: {
            in: {}
        }
    },
    sources: {
        values: {
            out: {
                async get() {
                    return filterBlanks(await this.in)
                }
            }
        }
    },
}

function filterBlanks(list) {
    const filtered = list.filter(item => !(item == null || item === ""))
    return filtered.map(item => item?.map ? filterBlanks(item) : item)
}