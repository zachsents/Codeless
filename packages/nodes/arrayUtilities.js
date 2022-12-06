
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