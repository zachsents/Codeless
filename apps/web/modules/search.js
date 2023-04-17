
import fuzzy from "fuzzy"


const searches = [
    {
        selector: x => x.name,
        weight: 3,
    },
    {
        selector: x => x.description,
        weight: 1,
    },
    {
        selector: x => x.tags.join(", "),
        weight: 1,
    },
]


export class NodeDefinitionSearcher {

    constructor(list) {
        this.list = Array.isArray(list) ? list : Object.values(list)
    }

    search(query) {
        let scores = {}
        searches.forEach(({ selector, weight }) => {
            fuzzy.filter(query, this.list, {
                extract: selector,
            })
                .forEach(result => {
                    scores[result.original.id] ??= 0
                    scores[result.original.id] += result.score * weight
                })
        })

        scores = Object.entries(scores)
        scores.sort((a, b) => b[1] - a[1])
        return scores.map(([id]) => id)
    }
}
