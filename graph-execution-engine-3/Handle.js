

/**
 * @typedef {import("./Node.js").Node} Node
 */

/**
 * @typedef {import("./Edge.js").Edge} Edge
 */


export class Handle {

    /**
     * Parses handle ID into a name and index.
     * @param {string} id
     * @return {{ name: string, index: string | number }}
     */
    static parseId(id) {
        const [name, index] = id.split(".")
        const parsedIndex = Number(index)
        return {name, index: isNaN(parsedIndex) ? index : parsedIndex}
    }

    /**
     * Handle ID
     * @type {string}
     * @memberof Handle
     */
    id

    /**
     * Node this handle belongs to
     * @type {Node}
     * @memberof Handle
     */
    node

    /**
     * The edges that are connected to this handle.
     * @type {Edge[]}
     * @memberof Handle
     */
    edges


    /**
     * Creates an instance of Handle.
     * @param {Node} node The node this handle belongs to
     * @param {string} id The ID of this handle
     * @param {Edge[]} edges The edges this handle is connected to
     * @memberof Handle
     */
    constructor(node, id, edges = []) {
        this.node = node
        this.id = id
        this.edges = edges
    }

    /**
     * The name of the handle
     * @type {string}
     * @readonly
     * @memberof Handle
     */
    get name() {
        return Handle.parseId(this.id).name
    }

    /**
     * The index of the handle. Only defined for list handles.
     * @type {string | number}
     * @readonly
     * @memberof Handle
     */
    get index() {
        return Handle.parseId(this.id).index
    }

    /**
     * The definition of the handle.
     * @type {import("./NodeDefinition.js").InputDefinition | import("./NodeDefinition.js").OutputDefinition}
     * @readonly
     * @memberof Handle
     */
    get definition() {
        return this.node.definition.getHandleDefinition(this.id)
    }
}


export class InputHandle extends Handle {

    /**
     * Creates an instance of InputHandle.
     * @param {Node} node The node this handle belongs to
     * @param {string} id The ID of this handle
     * @param {Edge[]} edges The edges this handle is connected to
     * @memberof InputHandle
     */
    constructor(node, id, edges) {
        super(node, id, edges)
    }


    /**
     * Whether or not this input has enough values to run.
     * @type {boolean}
     * @readonly
     * @memberof InputHandle
     */
    get satisfied() {
        return this.edges.every(edge => edge.stack.length > 0)
    }


    /**
     * Notifies the input handle that a value has been added to
     * a connected edge's stack.
     * @memberof InputHandle
     */
    notify() {
        if(this.satisfied)
            this.node.notify()
    }

    /**
     * Consumes a value from all connected edges.
     * @return {*[]} 
     * @memberof InputHandle
     */
    consume() {
        return this.edges.map(edge => edge.consume())
    }
}


export class OutputHandle extends Handle {

    /**
     * Creates an instance of OutputHandle.
     * @param {Node} node The node this handle belongs to
     * @param {string} id The ID of this handle
     * @param {Edge[]} edges The edges this handle is connected to
     * @memberof OutputHandle
     */
    constructor(node, id, edges) {
        super(node, id, edges)
    }

    /**
     * Push a value onto edges connected to this handle.
     * @param {*} value
     * @memberof OutputHandle
     */
    push(value) {
        this.edges.forEach(edge => edge.push(value))
    }
}