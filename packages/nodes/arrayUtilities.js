
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