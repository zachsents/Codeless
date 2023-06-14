import _ from "lodash"


export * from "./safe-map.js"
export * from "./schedules.js"
export * from "./run-status.js"


/**
 * A utility function that converts an array of paths to an object.
 * Created in order to make it easier to use useQueries with nested
 * objects.
 * 
 * @param {string[][]} paths
 * @param {any[]} values Must be same length as paths
 * @returns {object}
 * @export
 */
export function pathsToObject(paths, values) {
    const obj = {}
    paths.forEach((path, i) => _.set(obj, path, values[i]))
    return obj
}



/**
 * A utility function that converts an object to an array of paths.
 * You can get the values of all the paths at once using lodash's 
 * _.at function.
 *
 * @export
 * @param {object} obj
 * @return {string[][]} 
 */
export function objectToPaths(obj) {

    return Object.entries(obj).flatMap(([key, val]) => {

        if (typeof val !== "object" || val == null)
            return [key]

        return objectToPaths(val).map(subPath => [key, ...subPath])
    })
}


export function plural(str, q) {
    return q == 1 ? str : str + "s"
}
