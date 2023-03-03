import util from "util"

export class ValueTracker {

    static cleanValue(dirty, inArray = false) {
        if (dirty == null)
            return dirty ?? null
    
        const value = dirty.valueOf()
        const isPrimitive = value !== Object(value)
        const isPlainObject = value.constructor === Object
        const isArray = value.constructor === Array
        const isCircular = util.format("%j", value) == "[Circular]"
    
        if (isArray)
            return inArray ? dirty.join(", ") : dirty.map(x => ValueTracker.cleanValue(x, true))
    
        if ((isPrimitive || isPlainObject) && !isCircular)
            return value
    
        return dirty.toString()
    }

    /**
     * Map of keys to outputs. Values will either be in arrays.
     * @type {Object.<string, Array>}
     * @memberof Tracker
     */
    items = {}

    /**
     * Whether to return multiple values for each key or not.
     * @type {boolean}
     * @memberof ValueTracker
     */
    multiple

    /**
     * Creates an instance of ValueTracker.
     * @param {boolean} [multiple=true] Whether to return multiple values
     * for each key or not. Defaults to true.
     * @memberof ValueTracker
     */
    constructor(multiple = true) {
        this.multiple = multiple
    }

    /**
     * Adds a value to the tracker.
     * @param {string} key
     * @param {*} value
     * @param {boolean} [clean=false] Whether or not to clean the output
     * @memberof ValueTracker
     */
    report(key, value, clean = false) {
        (this.items[key] ??= []).push(
            clean ? ValueTracker.cleanValue(value, this.multiple) : value
        )
    }

    /**
     * Get the values from the tracker.
     * @memberof ValueTracker
     */
    get() {
        return this.multiple ? this.items : Object.fromEntries(
            Object.entries(this.items).map(([key, values]) => [key, values[0]])
        )
    }
}
