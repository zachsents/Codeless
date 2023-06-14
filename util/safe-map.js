import _ from "lodash"
import pMap from "p-map"


const defaultOptions = {
    maxBehavior: "throw",
}


/**
 * @typedef {object} SafeMapOptions
 * @property {number} concurrency
 * @property {number} max
 * @property {"throw" | "clip"} maxBehavior
 */


/**
 * @typedef {(...elements: *) => *} SafeMapOperation
 */


/**
 * Works like Array.prototype.map, but with multiple arrays. If arrays are the same
 * length, elements are matched up in the operation function call. If an array
 * is only of length 1, then it is used for every element in the other arrays.
 *
 * @export
 * @param {SafeMapOptions | SafeMapOperation} optionsOrOperation Either the options or the operation
 * @param {SafeMapOperation | any} operationOrFirstList Either the operation or the first list
 * @param {...any[]} args One or more arrays to map over
 * @return {Promise<any[]>} 
 */
export function safeMap(optionsOrOperation, operationOrFirstList, ...args) {

    // Parse arguments
    let options, operation, lists

    if (typeof optionsOrOperation === "function") {
        operation = optionsOrOperation
        lists = [operationOrFirstList, ...args]
        options = defaultOptions
    }

    else if (typeof args[0] === "object" && args[0] !== null) {
        options = { ...defaultOptions, ...optionsOrOperation }
        operation = operationOrFirstList
        lists = args
    }

    // Make sure everything's an array
    lists.forEach((list, i) => {
        lists[i] = _.castArray(list)
    })

    // Find longest array to map through
    let longestLength = lists.reduce(
        (longest, current) => current.length > longest ? current.length : longest, 0
    )

    // Clip or throw if max is exceeded
    if (options.max && longestLength > options.max) {
        switch (options.maxBehavior) {
            case "clip":
                lists.forEach((list, i) => lists[i] = list.slice(0, options.max))
                longestLength = options.max
                break
            case "throw":
                throw new Error(`Max length of ${options.max} exceeded.`)
        }
    }

    // Create mapper for result
    const mapper = (_, i) => operation(
        ...lists.map(list => {
            if (i in list)
                return list[i]

            return list.length == 1 ? list[0] : undefined
        })
    )

    // Optionally limit concurrency with p-map
    return pMap(Array(longestLength).fill(), mapper, {
        concurrency: options.concurrency,
    })
}
