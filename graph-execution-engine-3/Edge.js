

/**
 * @typedef {import("./Handle.js").InputHandle} InputHandle
 * @typedef {import("./Handle.js").OutputHandle} OutputHandle
 */


export class Edge {

    /**
     * The handle that pushes values to this edge.
     * @type {InputHandle}
     * @memberof Edge
     */
    inputHandle

    /**
     * The handle that consumes values from this edge.
     * @type {OutputHandle}
     * @memberof Edge
     */
    outputHandle

    /**
     * Stack of values that have been pushed to this edge.
     * @type {*[]}
     * @memberof Edge
     */
    stack = []

    /**
     * Creates an instance of Edge.
     * @param {InputHandle} inputHandle The handle that pushes values to this edge.
     * @param {OutputHandle} outputHandle The handle that consumes values from this edge.
     * @memberof Edge
     */
    constructor(inputHandle, outputHandle) {
        this.inputHandle = inputHandle
        this.outputHandle = outputHandle
    }

    /**
     * Push a value onto this edge.
     * @param {*} value
     * @memberof Edge
     */
    push(value) {
        this.stack.push(value)
        this.inputHandle.notify()
    }

    /**
     * Consume a value from this edge.
     * @return {*} 
     * @memberof Edge
     */
    consume() {
        return this.stack.shift()
    }
}