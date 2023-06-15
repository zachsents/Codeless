

/**
 * Maps an array to a Promise and returns the result
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @param {(element: T, index: number, array: Array<T>) => Promise} callback
 */
export function asyncMap(array, callback) {
    return Promise.all(array.map(callback))
}


/**
 * Maps an array to a Promise and returns the result with
 * any falsy values removed.
 *
 * @export
 * @param {Array<T>} array
 * @param {(element: T, index: number, array: Array<T>) => Promise} callback
 */
export function asyncMapFilterBlanks(array, callback) {
    return Promise.all(array.map(callback))
        .then(results => results.filter(Boolean))
}