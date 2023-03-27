
/**
 * @class Variable
 * 
 * Essentially an implementation of an Observable, used to store
 * a value on the Graph scope.
 */

export class Variable {

    subscribers = []

    constructor(graph) {
        this.graph = graph
    }

    subscribe(callback) {
        this.subscribers.push(callback)
    }

    subscribePromise() {
        return new Promise(resolve => {
            this.subscribers.push(resolve)
        })
    }

    publish(value) {
        this.subscribers.forEach(sub => sub(value))
    }
}