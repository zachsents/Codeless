import util from "util"


export class ValueTracker {

    /**
     * Cleans a value for storage in Firestore. Firestore documents
     * cannot contain circular references and nested arrays. This function
     * also prioritizes primitive values over objects, and toString is used
     * when applicable.
     * 
     * Note, the order of the if statements is important. For example, functions
     * and symbols are handled before primitives, because we check for primitives
     * by checking if the type is not an object.
     * @static
     * @param {*} value
     * @param {boolean} [inArray=false] Whether the value is in an array or not.
     */
    static cleanValue(value, inArray = false) {

        // Convert undefined to null
        if (value == null)
            return null

        // If value is a function, return "[Function]"
        if (typeof value === "function")
            return "[Function]"

        // If value is a Symbol, return "[Symbol]"
        if (typeof value === "symbol")
            return "[Symbol]"

        // If value is a primitive or a Date, return it
        if (typeof value !== "object" || value instanceof Date)
            return value

        // If value has a toString method, use it
        if (Object.prototype.hasOwnProperty.call(value, "toString"))
            return value.toString()

        // If value is an array...
        if (Array.isArray(value)) {
            // If we're in an array, then stringify it this
            if (inArray)
                return JSON.stringify(value)

            // otherwise, clean each value in the array
            return value.map(v => ValueTracker.cleanValue(v, true))
        }

        // If value is not a plain object and its constructor has a toString method, then use it
        if (
            value.constructor !== Object &&
            value.constructor != null &&
            Object.prototype.hasOwnProperty.call(value.constructor.prototype, "toString")
        )
            return value.toString()

        // if value has circular references, return "[Circular]"
        if (util.format("%j", value) === "[Circular]")
            return "[Circular]"

        // create plain object from value -- this catches class instances
        const plain = Object.assign({}, value)

        // if value is too large, return "[Object]"
        if (JSON.stringify(plain).length > 10_000)
            return "[Object]"

        // clean each value in the object
        return Object.fromEntries(
            Object.entries(plain)
                // filter out keys that are empty strings
                .filter(([key]) => !!key)
                .map(([key, value]) => [key, ValueTracker.cleanValue(value)])
        )
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
     * @memberof ValueTracker
     */
    report(key, value) {

        // if multiple flag is not set, just clean the value and set it
        if (!this.multiple)
            return this.items[key] = ValueTracker.cleanValue(value)

        // multiple flag is set, let's make sure there's an array for the key
        this.items[key] ??= []

        // if value is an array, clean and push each value
        if (Array.isArray(value))
            return value.map(v => ValueTracker.cleanValue(v)).forEach(v => this.items[key].push(v))

        // otherwise, just clean and push the value
        this.items[key].push(ValueTracker.cleanValue(value))
    }

    /**
     * Get the values from the tracker.
     * @memberof ValueTracker
     */
    get() {
        return this.items
    }
}
