
/**
 * @typedef PromiseStreamOptions
 * @type {object}
 * @property {boolean} logErrors Whether or not errors are logged to the console
 */


export class PromiseStream {

    /**
     * Who to notify when there are no more pending promises
     * @type {Function[]}
     * @memberof PromiseStream
     */
    subscribers = []


    /**
     * Number of promises in the stream.
     * @type {number}
     * @memberof PromiseStream
     */
    totalPromises = 0

    /**
     * Number of resolved promises from the stream.
     * @type {number}
     * @memberof PromiseStream
     */
    resolvedPromises = 0

    /**
     * Number of failed promises from the stream.
     * @type {number}
     * @memberof PromiseStream
     */
    failedPromises = 0


    /**
     * @type {PromiseStreamOptions}
     * @memberof PromiseStream
     */
    options


    /**
     * Creates an instance of PromiseStream.
     * @param {PromiseStreamOptions} [options]
     * @memberof PromiseStream
     */
    constructor({
        logErrors = false,
    } = {}) {
        this.options = {
            logErrors,
        }
    }


    /**
     * Adds a Promise to the stream. Also returns a Promise that
     * can be used to further handle errors & outputs.
     *
     * @param {Promise} promise
     * @return {Promise} 
     * @memberof PromiseStream
     */
    add(promise) {
        this.totalPromises++
        return new Promise((resolve, reject) => {
            promise
                .then(result => {
                    this.resolvedPromises++
                    resolve(result)
                })
                .catch(error => {
                    this.failedPromises++
                    reject(error)
                    if (this.options.logErrors)
                        console.error(error)
                })
                .finally(() => {
                    // if all promises are fulfilled
                    if (this.resolvedPromises + this.failedPromises >= this.totalPromises)
                        // notify subscribers
                        this.subscribers.forEach(resolve => resolve())
                })
        })
    }


    /**
     * Watch the Promise stream. Returns a Promise that resolves
     * once the stream is complete.
     *
     * @return {Promise<void>} 
     * @memberof PromiseStream
     */
    watch() {
        return new Promise(resolve => {
            this.subscribers.push(resolve)
        })
    }
}
