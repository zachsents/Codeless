
import { useDebouncedValue } from "@mantine/hooks"
import fuzzy from "fuzzy"
import _ from "lodash"
import { useMemo, useState } from "react"


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


const DELIMITER = "***"

/**
 * Better search hook.
 *
 * @export
 * @param {any[]} list
 * @param {object} [options]
 * @param {Function} [options.selector]
 * @param {number} [options.debounce]
 * @param {boolean} [options.highlight]
 * @return {[any[], string, Function, string[][]]} 
 */
export function useSearch(list, {
    selector,
    debounce,
    highlight = false,
} = {}) {

    const [query, setQuery] = useState("")
    let queryToUse = query

    if (debounce != null) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [debouncedQuery] = useDebouncedValue(query, debounce)
        queryToUse = debouncedQuery
    }

    const [filtered, strings] = useMemo(
        () => _.unzip(
            fuzzy.filter(queryToUse, list, {
                extract: selector,
                pre: DELIMITER,
                post: DELIMITER,
            })
                .map(result => [result.original, result.string.split(DELIMITER)])
        ),
        [list, queryToUse]
    )

    return [filtered ?? [], query, setQuery, highlight && (strings ?? [])]
}