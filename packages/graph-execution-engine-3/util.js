import { Errors, Outputs, Returns } from "./outputs.js"
import { PromiseStream } from "./promiseStream.js"
import * as util from "util"


export async function startGraph(nodes, setupPayload) {
    // fire beforeStart event
    await Promise.all(
        nodes.map(node =>
            node.type.onBeforeStart?.bind(node)()
        )
    )

    // fire start event
    nodes.forEach(node => PromiseStream.add(
        node.type.onStart?.bind(node)(setupPayload)
    ))

    // watch empty promise to indicate starting finished
    PromiseStream.add(Promise.resolve())

    return PromiseStream.finished()
}


export function prepGraph(nodes, edges, nodeTypes) {
    nodes.forEach(
        node => prepNode(node, nodeTypes[node.type], nodes, edges)
    )
}


function prepNode(node, nodeType, nodes, edges) {

    // attach node type def
    node.type = nodeType

    // establish map of outgoing connections
    node.outgoingConnections = Object.fromEntries(
        getOutputHandles(node.id, nodes, edges).map(output => [
            output.name ?? output,
            getConnectedHandles(node.id, output, nodes, edges)
        ])
    )

    // establish map of expected number of incoming connections
    node.expectedInputs = Object.fromEntries(
        getInputHandles(node.id, nodes, edges).map(input => [
            input.name ?? input,
            expectSingleValue(input) ? 1 : getConnectedHandles(node.id, input, nodes, edges).length
        ])
    )

    // set up other node properties
    node.timesRan = 0
    node.returnToFlow = (key, value) => {
        Returns.report(key, cleanOutput(value, true))
    }

    // create publish function -- pushes output values to connected input
    node.publish = function publish(valuesObject) {

        // report published values
        Outputs.report(
            node.id,
            // need to map values to primitives
            Object.fromEntries(
                Object.entries(valuesObject).map(([key, val]) =>
                    [key, val && cleanOutput(val)]
                )
            )
        )

        Object.entries(valuesObject).forEach(([output, value]) => {
            node.outgoingConnections[output]?.forEach(conn => {
                // ensure what we need exists
                conn.node.inputs ??= {}
                conn.node.inputs[conn.handle] ??= []

                // push in our value
                conn.node.inputs[conn.handle].push(value)

                // check if all inputs are satisfied
                const inputsSatisfied = Object.entries(conn.node.expectedInputs).every(
                    ([input, expected]) => conn.node.inputs[input]?.length >= expected
                )
                if (inputsSatisfied) {

                    // Make a mutable copy of our inputs
                    const nodeInputs = { ...conn.node.inputs }

                    // Here is where we can transform our data
                    Object.keys(nodeInputs).forEach(inputId => {
                        const { name: inputName } = parseListHandle(inputId)
                        const inputDef = conn.node.type.inputs.find(
                            input => (input.name ?? input) == inputName
                        )

                        // go from [ [...] ] to [...]
                        if (nodeInputs[inputId].length == 1 && nodeInputs[inputId][0] instanceof Array)
                            nodeInputs[inputId] = nodeInputs[inputId][0]

                        // option: pass a single value instead of an array
                        if (expectSingleValue(inputDef))
                            // use last value in array
                            nodeInputs[inputId] = nodeInputs[inputId][nodeInputs[inputId].length - 1]
                    })

                    // combine list handle inputs into one array
                    fixListInputs(nodeInputs, conn.node.state)

                    // increment run counter
                    node.timesRan++

                    // call node's onInputsReady function
                    const nodeOutput = () => conn.node.type.onInputsReady?.bind(conn.node)(nodeInputs)

                    // use PromiseStream to await nodes and process outputs/errors
                    PromiseStream.add(Promise.resolve().then(nodeOutput), {
                        onReject: error => console.error(error) || Errors.report(conn.node.id, {
                            type: conn.node.type.id,
                            message: error.message,
                        }),
                    })
                }
            })
        })
    }
}


export function findUnknownTypes(nodes, nodeTypes) {
    const badTypes = nodes.filter(node => !nodeTypes[node.type]).map(node => `\t- ${node.type}`)
    if (badTypes.length > 0)
        throw new Error(
            `Couldn't find node type definition for the following types:
${badTypes.join("\n")}
Did you make sure to export them?`
        )
}


function getInputHandles(nodeId, nodes, edges) {
    return [...new Set(
        edges.filter(edge => edge.target == nodeId)
            .map(edge => edge.targetHandle)
    )]
}


function getOutputHandles(nodeId, nodes, edges) {
    return [...new Set(
        edges.filter(edge => edge.source == nodeId)
            .map(edge => edge.sourceHandle)
    )]
}


function getConnectedHandles(nodeId, handleName, nodes, edges) {
    return edges
        .filter(edge =>
            (edge.target == nodeId && edge.targetHandle == handleName) ||
            (edge.source == nodeId && edge.sourceHandle == handleName)
        )
        .map(edge =>
            edge.target == nodeId ? {
                node: getNode(edge.source, nodes),
                handle: edge.sourceHandle
            } : {
                node: getNode(edge.target, nodes),
                handle: edge.targetHandle
            }
        )
}


function getNode(nodeId, nodes) {
    return nodes.find(node => node.id == nodeId)
}


function expectSingleValue(input) {
    return input.expectSingleValue ?? (input.name ?? input).startsWith("$")
}


function parseListHandle(id) {
    const [, name, index] = id.match(/(.+?)(?:\.(\w+))?$/) ?? []
    return { name, index }
}


function cleanOutput(dirty, inArray = false) {
    if (dirty == null)
        return dirty ?? null

    const value = dirty.valueOf()
    const isPrimitive = value !== Object(value)
    const isPlainObject = value.constructor === Object
    const isArray = value.constructor === Array
    const isCircular = util.format("%j", value) == "[Circular]"

    if (isArray)
        return inArray ? dirty.join(", ") : dirty.map(x => cleanOutput(x, true))

    if ((isPrimitive || isPlainObject) && !isCircular)
        return value

    return dirty.toString()
}


function fixListInputs(inputs, nodeState) {
    Object.keys(inputs).forEach(inputId => {
        const { name: inputName, index } = parseListHandle(inputId)

        if (index == null)
            return  // not a list input

        // grab label from node state
        const label = nodeState[`_${inputName}Labels`].find(label => label.id == index).value

        // set up empty array
        inputs[inputName] ??= []

        // we'll transform each value to have the label attached
        const transform = value => ({ id: index, label, value })

        // if it's an array, we'll map it and add a special property
        if(inputs[inputId] instanceof Array) {
            const inputArr = inputs[inputId].map(transform)
            inputArr._label = label
            inputs[inputName].push(inputArr)
            return
        }

        // otherwise, we'll just add the single value
        inputs[inputName].push(transform(inputs[inputId]))
    })
}