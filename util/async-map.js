

/**
 * Maps an array to a Promise and returns the result
 *
 * @export
 * @param {any[]} array
 * @param {Function} callback
 */
export function asyncMap(array, callback) {
    return Promise.all(array.map(callback))
}


/**
 * Maps an array to a Promise and returns the result with
 * any falsy values removed.
 *
 * @export
 * @param {any[]} array
 * @param {Function} callback
 */
export function asyncMapFilterBlanks(array, callback) {
    return Promise.all(array.map(callback))
        .then(results => results.filter(Boolean))
}