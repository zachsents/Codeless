
var errors = {}



/**
 * Reports an error that occur during the flow so we can return them to the caller.
 *
 * @export
 * @param {Object} errorObj
 * @param {string} errorObj.id
 * @param {string} errorObj.type
 * @param {string} errorObj.message
 * @param {Error} errorObj.fullError
 */
export function reportError(id, errorObj) {
    if(errors[id])
        errors[id].push(errorObj)
    else
        errors[id] = [errorObj]
}


export function clearErrors() {
    errors = {}
}


export function getErrors() {
    return errors
}