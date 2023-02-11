
export const PromiseStream = {

    // who to notify when there are no more pending promises
    subscribers: [],

    // track total and resolved promises to determine if there are pending ones
    totalPromises: 0,
    resolvedPromises: 0,
    failedPromises: 0,

    add(promise, { onResolve, onReject } = {}) {

        if (!promise?.then)
            return

        this.totalPromises++
        promise
            .then(result => {
                this.resolvedPromises++
                onResolve?.(result)
            })
            .catch(error => {
                this.failedPromises++
                onReject?.(error)
            })
            .finally(() => {
                // if all promises are fulfilled
                if (this.resolvedPromises + this.failedPromises >= this.totalPromises)
                    // notify subscribers
                    this.subscribers.forEach(resolve => resolve())
            })
    },

    finished() {
        return new Promise(resolve => {
            this.subscribers.push(resolve)
        })
    }
}
