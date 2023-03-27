import { ArrayMode } from "./ArrayMode.js"
import { Handle } from "./Handle.js"


/**
 * @typedef InputDefinition
 * @type {object}
 * @property {string} name - Input handle name. Also the ID unless it's a list handle.
 * @property {string} arrayMode - How this input handles arrays.
 */

/** @type {InputDefinition} */
const DEFAULT_INPUT_DEFINITION = {
    name: "",
    arrayMode: ArrayMode.Flat,
}


/**
 * @typedef OutputDefinition
 * @type {object}
 * @property {string} name - Output handle name. Also the ID unless it's a list handle.
 */

/** @type {OutputDefinition} */
const DEFAULT_OUTPUT_DEFINITION = {
    name: "",
}


/**
 * @callback OnStartCallback
 * @param {*} setupPayload
 * @return {void | Promise<void>}
 */


/**
 * @callback OnInputsReadyCallback
 * @param {Object.<string, *>} inputs
 * @return {void | Promise<void>}
 */


export class NodeDefinition {

    /**
     * Map of registered node definitions. Definitions are keyed by their ID.
     * @static
     * @type {Object.<string, NodeDefinition>}
     * @memberof NodeDefinition
     */
    static definitions = {}

    /**
     * Registers a package containing node definitions. Definitions must be
     * exported as the default export, and can be in an array or object.
     * @async
     * @static
     * @param {string} packageName 
     */
    static async registerPackage(packageName) {
        NodeDefinition.registerImportedPackage(await import(packageName))
    }

    /**
     * Registers a node definitions from a package that was dynamically imported. We need
     * this to solve dependency issues caused by passing a package name to registerPackage.
     * @async
     * @static
     * @param {Promise<{ default: Object.<string, object> | Array<object> }>} importedPackage
     */
    static async registerImportedPackage(importedPackage) {
        const definitions = (await importedPackage).default
        NodeDefinition.registerDefinitions(
            typeof definitions === "function" ? await definitions() : definitions
        )
    }

    /**
     * Registers multiple definitions.
     * @param {Object.<string, object> | Array<object>} definitions 
     */
    static registerDefinitions(definitions) {
        Object.values(definitions).forEach(
            def => NodeDefinition.definitions[def.id] = new NodeDefinition(def)
        )
    }

    /**
     * Registers a single definition.
     * @param {object} definition 
     */
    static registerDefinition(definition) {
        NodeDefinition.definitions[definition.id] = new NodeDefinition(definition)
    }

    /**
     * Gets a node definition from an ID.
     * @param {string} nodeDefinitionId 
     * @return {NodeDefinition}
     */
    static get(nodeDefinitionId) {
        return this.definitions[nodeDefinitionId]
    }

    /**
     * Node Definition ID
     * @type {string}
     * @memberof NodeDefinition
     */
    id

    /**
     * Node inputs
     * @type {InputDefinition[]}
     * @memberof NodeDefinition
     */
    inputs

    /**
     * Node outputs
     * @type {OutputDefinition[]}
     * @memberof NodeDefinition
     */
    outputs

    /**
     * Ran before onStart. This is useful for setting up listeners that need
     * to be in place before the flow runs.
     * @type {() => undefined}
     * @memberof NodeDefinition
     */
    onBeforeStart

    /**
     * Ran at the beginning of flow run with the setup payload. This is what
     * starts the chain reaction of values being pushed, starting the flow.
     * @type {OnStartCallback}
     * @memberof NodeDefinition
     */
    onStart

    /**
     * Ran when inputs to a node are ready.
     * @type {OnInputsReadyCallback}
     * @memberof NodeDefinition
     */
    onInputsReady

    /**
     * Creates an instance of NodeDefinition. Formats shorthand inputs and 
     * outputs.
     * @param {object} definition 
     */
    constructor(definition) {

        const { inputs, outputs, ...otherProperties } = definition

        // create full InputDefinition objects from raw (potentially shorthand) inputs
        this.inputs = inputs?.map(
            rawInput => {
                const fullInput = Object.assign({},
                    DEFAULT_INPUT_DEFINITION,
                    typeof rawInput === "string" ? { name: rawInput } : rawInput
                )

                // $ is shorthand for flat single
                if(fullInput.name.startsWith("$"))
                    fullInput.arrayMode = ArrayMode.FlatSingle

                return fullInput
            }
        ) ?? []

        // create full OutputDefinition objects from raw (potentially shorthand) outputs
        this.outputs = outputs?.map(
            rawOutput => Object.assign({},
                DEFAULT_OUTPUT_DEFINITION,
                typeof rawOutput === "string" ? { name: rawOutput } : rawOutput
            )
        ) ?? []

        // copy all other properties
        Object.entries(otherProperties).forEach(([key, val]) => {
            this[key] = val
        })
    }

    /**
     * Gets a handle definition given the name or ID of a handle.
     * @param {string} handleNameOrId 
     * @return {InputDefinition | OutputDefinition}
     */
    getHandleDefinition(handleNameOrId) {
        const { name } = Handle.parseId(handleNameOrId)
        return this.inputs.find(input => input.name == name) ?? this.outputs.find(output => output.name == name)
    }
}
