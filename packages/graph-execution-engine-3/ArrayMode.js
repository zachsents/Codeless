
/**
 * @callback ArrayModeCallback
 * @param {*[]} array
 * @return {*}
 */


export const ArrayMode = {
    Flat: "flat",
    Single: "single",
    FlatSingle: "flat-single",
}


/**
 * @type {Object.<string, ArrayModeCallback>}
 */
const ArrayModes = {
    [ArrayMode.Flat]: arr => arr.flat(),
    [ArrayMode.Single]: arr => arr[0],
    [ArrayMode.FlatSingle]: arr => arr.flat()[0],
}


/**
 * Processes an array using the passed array mode.
 * @param {string} arrayMode 
 * @param {*[]} array
 */
export function processArray(arrayMode, array) {
    return ArrayModes[arrayMode](array)
}