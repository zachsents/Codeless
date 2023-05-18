import _ from "lodash"

/**
 * Extending the Array prototype with a bunch of utilities
 */

// Converts single element arrays to that single element
export function delist(list) {
    return list.length == 1 ? list[0] : list
}

// Checks whether list array is multi-dimensional
export function isDeeper(list) {
    return list.every(el => el?.map)
}

// Executes an operation on a nested array as deep as possible
export function recurse(list, operation) {
    return isDeeper(list) ? list.map(el => recurse(el, operation)) : operation?.(list)
}

// Does an operation either scalar-wise or element-wise
// If a = [1, 2, 3, ...] and b = [1] -> scalar-wise
// If a = [1, 2, 3, ...] and b = [1, 2, ...] -> element-wise
export function elementWise(aList, bList, operation) {
    return bList.length == 1 ?
        aList.map(a => operation(a, bList[0])) :
        aList.map((a, i) => operation(a, bList[i]))
}

/**
 * Works like Array.map, but with multiple arrays. If arrays are the same
 * length, elements are matched up in the operation function call. If an array
 * is only of length 1, then it is used for every element in the other arrays.
 *
 * @export
 * @param {(...elements: *) => *} operation
 * @param {...any[]} lists One or more arrays to map over
 * @return {any[] | Promise<any[]>} 
 */
export function safeMap(operation, ...lists) {
    // make sure everything's an array
    lists.forEach((list, i) => {
        lists[i] = _.castArray(list)
    })

    // find longest array to map through
    const longest = lists.reduce(
        (longest, current) => current.length > longest.length ? current : longest
    )

    // map result
    const result = longest.map(
        (_, i) => operation(
            ...lists.map(list => {
                if (i in list)
                    return list[i]

                return list.length == 1 ? list[0] : undefined
            })
        )
    )

    // check for promises
    if (result.some(res => res instanceof Promise))
        return Promise.all(result)

    return result
}

export function expectRegexToBeGlobal(reg) {
    return reg instanceof RegExp && !reg.global ?
        new RegExp(reg.source, reg.flags + "g") :
        reg
}

export function deepFlat(arr) {
    if (arr.some(item => item instanceof Array))
        return deepFlat(arr.flat())
    return arr
}


/**
 * Converts an object with array values into an array of objects with the same
 * keys, but the values are the elements of the original arrays.
 *
 * @param {Object.<string, any[]>} obj
 */
export function unzipObject(obj) {
    return safeMap((...values) => Object.fromEntries(
        values.map((val, i) => [Object.keys(obj)[i], val])
    ), ...Object.values(obj))
}

/**
 * Converts an array of objects into an object with array values, where the
 * keys are the keys of the original objects, and the values are the elements
 * of the original arrays.
 *
 * @export
 * @param {object[]} objects
 */
export function zipObjects(objects) {
    // get all keys
    const keys = [...new Set(objects.flatMap(obj => Object.keys(obj ?? {})))]

    // reduce into object with array values
    return objects.reduce((acc, obj) => {
        // every object inserts a value for every key
        keys.forEach(key => {
            acc[key] ??= []
            acc[key].push(obj?.[key])
        })
        return acc
    }, {})
}