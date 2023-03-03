import { InputHandle, OutputHandle } from "./Handle.js"
import { NodeDefinition } from "./NodeDefinition.js"
import { processArray } from "./ArrayMode.js"
import { ValueTracker } from "./ValueTracker.js"


export class Node {

    /**
     * Map containing input handles keyed by their IDs.
     * @type {Object.<string, import("./Handle.js").InputHandle>}
     * @memberof Node
     */
    inputs = {}

    /**
     * Map containing output handles keyed by their IDs.
     * @type {Object.<string, import("./Handle.js").OutputHandle>}
     * @memberof Node
     */
    outputs = {}

    /**
     * Creates an instance of Node.
     * @param {import("./Graph.js").Graph} graph
     * @param {object} rfNode A node object directly from a ReactFlow graph
     * @memberof Node
     */
    constructor(graph, rfNode) {
        this.graph = graph
        this.rfNode = rfNode
    }

    /**
     * Node ID
     * @type {string}
     * @readonly
     * @memberof Node
     */
    get id() {
        return this.rfNode.id
    }

    /**
     * Node type definition ID
     * @type {string}
     * @readonly
     * @memberof Node
     */
    get type() {
        return this.rfNode.type
    }

    /**
     * Node state
     * @type {object}
     * @readonly
     * @memberof Node
     */
    get state() {
        return this.rfNode.data?.state ?? {}
    }

    /**
     * Node type definition
     * @type {NodeDefinition}
     * @readonly
     * @memberof Node
     */
    get definition() {
        return NodeDefinition.get(this.type)
    }

    /**
     * Whether or not the node has enough values on all its inputs
     * to run.
     * @type {boolean}
     * @readonly
     * @memberof Node
     */
    get satisfied() {
        return Object.values(this.inputs).every(input => input.satisfied)
    }


    /**
     * Fires the onBeforeStart event for a node
     * @async
     * @return {Promise<void>}
     * @memberof Node
     */
    async prepare() {
        return this.definition.onBeforeStart?.bind(this)()
    }

    /**
     * Fires the onStart event for a node
     * @async
     * @param {*} setupPayload
     * @return {Promise<void>} 
     * @memberof Node
     */
    async start(setupPayload) {
        return this.definition.onStart?.bind(this)(setupPayload)
    }

    /**
     * Fires the onInputsReady event with the passed inputs
     * @async
     * @param {Object.<string, *>} inputs
     * @memberof Node
     */
    async run(inputs) {
        return this.definition.onInputsReady?.bind(this)(inputs ?? {})
    }

    /**
     * Notifies the node that an input handle has been satisfied. If
     * all inputs are satisfied, the node consumes values from all
     * connected edges and runs.
     * @memberof Node
     */
    notify() {
        if (this.satisfied) {
            // create input values
            const inputValues = {}
            Object.values(this.inputs).forEach(input => {

                // make sure input definition exists
                if(input.definition == null)
                    throw new Error(`Invalid input: "${input.id}". The graph could be corrupted. Let Zach know.`)

                // do array mode transform
                const transformedValues = processArray(input.definition.arrayMode, input.consume())

                // for list handles -- put them in an array by index
                if (input.index != null) {
                    inputValues[input.name] ??= []
                    inputValues[input.name][input.index] = transformedValues
                    return
                }

                // for regular handles, just put them in by id
                inputValues[input.id] = transformedValues
            })

            // track inputs
            this.graph.inputTracker.report(this.id, inputValues)

            // run the node
            this.graph.promiseStream.add(
                this.run(inputValues)
            )
                // report errors
                .catch(err => this.graph.errorTracker.report(this.id, {
                    type: this.type,
                    message: err.message,
                }))
        }
    }

    /**
     * Publishes values on the outputs specified, consequently pushing
     * them to the inputs of the connected nodes.
     *
     * @param {Object.<string, *>} outputs
     * @memberof Node
     */
    publish(outputs) {
        // track outputs
        this.graph.outputTracker.report(
            this.id, 
            Object.fromEntries(
                Object.entries(outputs).map(([key, val]) =>
                    [key, val && ValueTracker.cleanValue(val)]
                )
            )
        )

        // push outputs to edges
        Object.entries(outputs).forEach(([key, value]) => {
            this.outputs[key]?.push(value)
        })
    }


    /**
     * Either inserts a new input handle or retrieves an existing one with
     * the passed ID.
     *
     * @param {string} handleId
     * @return {InputHandle} 
     * @memberof Node
     */
    upsertInput(handleId) {
        this.inputs[handleId] ??= new InputHandle(this, handleId)
        return this.inputs[handleId]
    }


    /**
     * Either inserts a new output handle or retrieves an existing one with
     * the passed ID.
     *
     * @param {string} handleId
     * @return {OutputHandle} 
     * @memberof Node
     */
    upsertOutput(handleId) {
        this.outputs[handleId] ??= new OutputHandle(this, handleId)
        return this.outputs[handleId]
    }
}
