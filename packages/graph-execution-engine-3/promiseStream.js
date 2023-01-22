
// who to notify when there are no more pending promises
const subscribers = []

// track total and resolved promises to determine if there are pending ones
let totalPromises = 0
let resolvedPromises = 0
let failedPromises = 0

export function subscribe() {
    return new Promise(resolve => {
        subscribers.push(resolve)
    })
}

export function watch(promise, catchError) {
    if (promise) {
        totalPromises++
        promise
            .then(() => {
                resolvedPromises++
            })
            .catch(error => {
                failedPromises++
                catchError?.(error)
            })
            .finally(() => {
                // if all promises are fulfilled
                if(resolvedPromises + failedPromises >= totalPromises)
                    subscribers.forEach(resolve => resolve())   // notify subscribers
            })
    }
}