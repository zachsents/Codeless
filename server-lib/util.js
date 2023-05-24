
export function deepFlat(arr) {
    if (arr.some(item => item instanceof Array))
        return deepFlat(arr.flat())
    return arr
}


/**
 * @typedef RegexObject
 * @property {string} source
 * @property {{
 *   g: boolean,
 *   i: boolean,
 *   m: boolean,
 *   s: boolean,
 *   u: boolean,
 *   y: boolean,
 *   d: boolean,
 * }} flags
 */



/**
 * Converts an object like the ones that come from the UI's
 * RegexControl component into a RegExp object.
 *
 * @export
 * @param {RegexObject} obj
 * @return {RegExp}
 */
export function regexFromObject(obj) {
    return new RegExp(
        obj.source,
        Object.entries(obj.flags)
            .filter(([, enabled]) => enabled)
            .map(([flag]) => flag)
            .join("")
    )
}


/**
 * If the given object is a RegExp, returns it. Otherwise,
 * converts it to a RegExp using regexFromObject.
 *
 * @export
 * @param {RegexObject | RegExp} obj
 * @return {RegExp} 
 */
export function safeRegex(obj) {
    return obj instanceof RegExp ? obj : regexFromObject(obj)
}


export function dataWithId(doc) {
    return {
        ...doc.data(),
        id: doc.id,
    }
}