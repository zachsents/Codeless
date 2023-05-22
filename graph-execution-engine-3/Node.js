import { Handle, InputHandle, OutputHandle } from "./Handle.js"
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
     * Gets the input mode of the specified input from the node's
     * data.
     *
     * @param {string} inputName
     * @return {"handle" | "config"} 
     * @memberof Node
     */
    getInputMode(inputName) {
        const entry = Object.entries(this.rfNode.data)
            .find(([key]) => key == `InputMode.${inputName}`)

        if (!entry || !entry[1]) {
            console.debug("There's a problem. Here's the node data:", this.rfNode.data)
            throw new Error(`Input mode cannot be found for ${inputName}. This could indicate a problem with the node definition.`)
        }

        return entry[1]
    }

    /**
     * Gets the input value of the specified input from the node's
     * data.
     *
     * @param {string} inputId
     * @return {*} 
     * @memberof Node
     */
    getInputValue(inputId) {
        return Object.entries(this.rfNode.data)
            .find(([key]) => key == `InputValue.${inputId}`)?.[1]
    }

    /**
     * Gets list data for an input name.
     *
     * @param {string} inputName
     * @return {Array<{ id: string, name: string? }>} 
     * @memberof Node
     */
    getListData(inputName) {
        return Object.entries(this.rfNode.data)
            .find(([key]) => key == `List.${inputName}`)?.[1]
    }

    /**
     * Processes an input value for running given the target input definition.
     *
     * @param {string} inputId
     * @return {*} 
     * @memberof Node
     */
    getProcessedInputValue(inputId) {
        // determine if input value should be from handle or config
        const isHandle = this.getInputMode(Handle.parseId(inputId).name) == "handle"

        // get array mode
        const arrayMode = this.definition.getHandleDefinition(inputId).arrayMode

        return processArray(
            arrayMode,
            isHandle ?
                (this.inputs[inputId]?.consume() ?? []) :
                [this.getInputValue(inputId)]
        )
    }

    /**
     * Gets the account ID for a specified integration.
     *
     * @param {string} integrationId
     * @memberof Node
     */
    getAccountId(integrationId) {
        return this.rfNode.data.accounts?.[integrationId]
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
     * Fires the onStart event for a node. Also checks to see if any inputs
     * are configured as handles. If not, then it fires onInputsReady, too.
     * @async
     * @param {*} setupPayload
     * @return {Promise<void>} 
     * @memberof Node
     */
    async start(setupPayload) {
        // fire onStart event
        await this.definition.onStart?.bind(this)(setupPayload)

        // notify so that onInputsReady is fired if necessary
        // (input satisfaction will be checked, so this shouldn't cause
        // onInputsReady to fire if it's not supposed to)
        this.notify()
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

            // create input values - loop through input definitions
            const inputValues = Object.fromEntries(
                this.definition.inputs.map(inputDef => {

                    // get list data if it exists
                    const listData = this.getListData(inputDef.name)

                    // determine if the list should be an array or object
                    const isNamedList = listData?.every(item => item.name != null) ?? false

                    // warn if there are names on some but not all
                    if (!isNamedList && listData?.some(item => item.name != null))
                        console.warn(`List data for ${inputDef.name} contains names on some items but not all. This will be treated as an array. If you want to use names, make sure all items have names.`)

                    // process values
                    const values = listData?.map(item => {
                        const val = this.getProcessedInputValue(`${inputDef.name}.${item.id}`)
                        return isNamedList ? [item.name, val] : val
                    })
                        ?? this.getProcessedInputValue(inputDef.name)

                    // if it's a named list, convert to object
                    return [inputDef.name, isNamedList ? Object.fromEntries(values) : values]
                })
            )

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
    publish(_outputs) {

        // convert raw outputs -- need this to handle list outputs
        // properly
        const outputs = Object.fromEntries(
            Object.entries(_outputs).flatMap(([key, val]) => {
                // get list data
                const listData = this.getListData(key)

                if (!listData)
                    return [[key, val]]

                // determine if the list should be an array or object
                const isNamedList = listData?.every(item => item.name != null)

                // if it is, return entries with the handle IDs looked up from the key names
                if (isNamedList)
                    return Object.entries(val).map(
                        ([k, v]) => [`${key}.${listData.find(item => item.name == k)?.id}`, v]
                    )

                // otherwise, just make an array in the same order
                return listData.map((item, i) => [`${key}.${item.id}`, val[i]])
            })
        )

        // track outputs -- use the raw ones
        this.graph.outputTracker.report(
            this.id,
            Object.fromEntries(
                Object.entries(_outputs).map(([key, val]) =>
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
