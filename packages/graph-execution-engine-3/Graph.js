import { Edge } from "./Edge.js"
import { Node } from "./Node.js"
import { PromiseStream } from "./PromiseStream.js"
import { ValueTracker } from "./ValueTracker.js"


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
     * Creates an instance of Graph.
     * @param {string} jsonString JSON-encoded string containing a nodes and edges object.
     * @memberof Graph
     */
    constructor(jsonString) {

        try {
            const parsed = JSON.parse(jsonString)
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
        this.outputTracker = new ValueTracker()
        this.errorTracker = new ValueTracker()
        this.returnTracker = new ValueTracker()

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
}