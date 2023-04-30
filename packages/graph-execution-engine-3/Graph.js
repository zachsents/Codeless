import { Edge } from "./Edge.js"
import { Node } from "./Node.js"
import { PromiseStream } from "./PromiseStream.js"
import { ValueTracker } from "./ValueTracker.js"
import { Variable } from "./Variable.js"


export class Graph {

    /**
     * @type {Node[]}
     * @memberof Graph
     */
    nodes

    /**
     * @type {Edge[]}
     * @memberof Graph
     */
    edges

    /**
     * Promise stream handling Promises created during graph run. 
     * Helps track when graph is finished running.
     * @type {PromiseStream}
     * @memberof Graph
     */
    promiseStream

    /**
     * ValueTracker that holds node input values.
     * @type {ValueTracker}
     * @memberof Graph
     */
    inputTracker

    /**
     * ValueTracker that holds node output values.
     * @type {ValueTracker}
     * @memberof Graph
     */
    outputTracker

    /**
     * ValueTracker that holds node errors.
     * @type {ValueTracker}
     * @memberof Graph
     */
    errorTracker

    /**
     * ValueTracker that holds values returned to the flow. This
     * is currently only used for special things like logs.
     * @type {ValueTracker}
     * @memberof Graph
     */
    returnTracker

    /**
     * Object that holds all variables on the graph.
     * @type {Object.<string, Variable>}
     * @memberof Graph
     */
    variables

    /**
     * Creates an instance of Graph.
     * @param {string | object[]} jsonStringOrNodes JSON-encoded string containing a nodes
     * and edges array, or, if passing in parsed nodes & edges, this is just
     * the nodes array.
     * @param {object[]} [edges] If passing in parsed nodes & edegs, this is the
     * edges array.
     * @memberof Graph
     */
    constructor(jsonStringOrNodes, edges) {

        // can either pass a graph string in or a nodes & edges array
        const parsed = jsonStringOrNodes instanceof Array &&
            edges instanceof Array ? { nodes: jsonStringOrNodes, edges } :
            JSON.parse(jsonStringOrNodes)

        try {
            this.rfGraph = { nodes: parsed.nodes, edges: parsed.edges }
        }
        catch (err) {
            throw new Error("Failed to parse graph.")
        }

        // create nodes
        this.nodes = this.rfGraph.nodes.map(rfNode => new Node(this, rfNode))

        // create edges
        this.edges = this.rfGraph.edges.map(rfEdge => {
            // find input handle
            const inputNode = this.nodes.find(node => node.id == rfEdge.target)
            const inputHandle = inputNode.upsertInput(rfEdge.targetHandle)

            // find output handle
            const outputNode = this.nodes.find(node => node.id == rfEdge.source)
            const outputHandle = outputNode.upsertOutput(rfEdge.sourceHandle)

            // create edge
            const edge = new Edge(inputHandle, outputHandle)

            // add edge to handles
            inputHandle.edges.push(edge)
            outputHandle.edges.push(edge)

            return edge
        })
    }


    /**
     * Runs a graph.
     * @param {*} setupPayload
     * @param {object} [options]
     * @param {import("./PromiseStream.js").PromiseStreamOptions} [options.promiseStreamOptions]
     * @memberof Graph
     */
    async run(setupPayload, {
        promiseStreamOptions,
    } = {}) {

        // setup new Promise stream & trackers
        this.promiseStream = new PromiseStream(promiseStreamOptions)
        this.inputTracker = new ValueTracker()
        this.outputTracker = new ValueTracker(false)
        this.errorTracker = new ValueTracker()
        this.returnTracker = new ValueTracker()
        this.variables = {}

        // prepare nodes (onBeforeStart)
        await Promise.all(this.nodes.map(node => node.prepare()))

        // start nodes
        this.nodes.forEach(
            node => this.promiseStream.add(node.start(setupPayload))
                // track errors
                .catch(err => this.errorTracker.report(node.id, {
                    type: node.type,
                    message: err.message,
                }))
        )

        // wait for Promise stream to finish
        await this.promiseStream.watch()

        // return tracker values
        return {
            inputs: this.inputTracker.get(),
            outputs: this.outputTracker.get(),
            errors: this.errorTracker.get(),
            returns: this.returnTracker.get(),
        }
    }


    /**
     * Returns values from the flow. This is currently only used 
     * for special things like logs.
     * @memberof Graph
     * @type {() => {}}
     */
    get return() {
        return this.returnTracker.report.bind(this.returnTracker)
    }

    /**
     * Creates a variable on the graph. If the variable already exists,
     * returns the existing variable.
     * 
     * Unless you're doing something specific, it's recommended
     * to use `subscribeToVariable` or `setVariable` instead, which
     * will create the variable if it doesn't exist.
     *
     * @param {string} name
     * @return {Variable} 
     * @memberof Graph
     */
    createVariable(name) {
        this.variables ??= {}
        return this.variables[name] ??= new Variable(this)
    }

    /**
     * Subscribes to a variable on the graph. Creates a variable if it doesn't exist.
     *
     * @param {string} name
     * @param {Function | true} callback If true, returns a promise instead of a callback subscription.
     * @return {void | Promise} 
     * @memberof Graph
     */
    subscribeToVariable(name, callback) {
        const variable = this.createVariable(name)

        // if callback is exactly true, return a promise. otherwise, return a callback subscription
        return callback === true ? variable.subscribePromise() : variable.subscribe(callback)
    }

    /**
     * Sets a variable on the graph. Creates a variable if it doesn't exist.
     *
     * @param {string} name
     * @param {*} value
     * @return {void} 
     * @memberof Graph
     */
    setVariable(name, value) {
        return this.createVariable(name).publish(value)
    }
}