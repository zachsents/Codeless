

export class ValueTracker {
    
    /**
     * Map of keys to outputs. Values will either be in arrays.
     * @type {Object.<string, Array>}
     * @memberof Tracker
     */
    items = {}

    /**
     * Adds a value to the tracker.
     * @param {string} key
     * @param {*} value
     * @memberof ValueTracker
     */
    report(key, value) {
        (this.items[key] ??= []).push(value)
    }

    /**
     * Get the values from the tracker. If the multiple flag is set
     * @param {boolean} [multiple=true] Whether to return multiple values
     * for each key or not. Defaults to true.
     * @memberof ValueTracker
     */
    get(multiple = true) {
        return multiple ? this.items : Object.fromEntries(
            Object.entries(this.items).map(([key, values]) => [key, values[0]])
        )
    }
}
