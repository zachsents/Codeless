
/**
 * @callback ArrayModeCallback
 * @param {*[]} array
 * @return {*}
 */


export const ArrayMode = {
    Flat: "flat",
    Single: "single",
    FlatSingle: "flat-single",
    PreferSingle: "prefer-single",
    FlatPreferSingle: "flat-prefer-single",
}


/**
 * @type {Object.<string, ArrayModeCallback>}
 */
const ArrayModes = {
    [ArrayMode.Flat]: arr => arr.flat(),
    [ArrayMode.Single]: arr => arr[0],
    [ArrayMode.FlatSingle]: arr => arr.flat()[0],
    [ArrayMode.PreferSingle]: arr => arr.length == 1 ? arr[0] : arr,
    [ArrayMode.FlatPreferSingle]: arr => {
        const flatArr = arr.flat()
        return flatArr.length == 1 ? flatArr[0] : flatArr
    },
}


/**
 * Processes an array using the passed array mode.
 * @param {string} arrayMode 
 * @param {*[]} array
 */
export function processArray(arrayMode, array) {
    return ArrayModes[arrayMode](array)
}