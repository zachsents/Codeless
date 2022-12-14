import { reportError } from "./errors.js"
import { watch } from "./promiseStream.js"


export function startGraph(nodes, setupPayload) {
    nodes.forEach(node => {
        watch(
            node.type.onStart?.bind(node)(setupPayload)
        )
    })
}


export function prepGraph(nodes, edges, nodeTypes) {
    // edges.forEach(
    //     edge => prepEdge(edge)
    // )
    nodes.forEach(
        node => prepNode(node, nodeTypes[node.type], nodes, edges)
    )
}


function prepNode(node, nodeType, nodes, edges) {

    // attach node type def
    node.type = nodeType

    // establish map of outgoing connections
    node.outgoingConnections = Object.fromEntries(
        nodeType.outputs.map(output => [
            output.name ?? output,
            getConnectedHandles(node.id, output, nodes, edges)
        ])
    )

    // establish map of expected number of incoming connections
    node.expectedInputs = Object.fromEntries(
        nodeType.inputs.map(input => [
            input.name ?? input,
            input.expectSingleValue ? 1 : getConnectedHandles(node.id, input, nodes, edges).length
        ])
    )

    // set up other node properties
    node.timesRan = 0

    // create publish function -- pushes output values to connected input
    node.publish = function publish(valuesObject) {
        Object.entries(valuesObject).forEach(([output, value]) => {
            node.outgoingConnections[output].forEach(conn => {
                // ensure what we need exists
                conn.node.inputs ??= {}
                conn.node.inputs[conn.handle] ??= []

                // push in our value
                // console.log(conn.node.inputs)
                conn.node.inputs[conn.handle].push(value)

                // check if all inputs are satisfied
                const inputsSatisfied = Object.entries(conn.node.expectedInputs).every(
                    ([input, expected]) => conn.node.inputs[input]?.length >= expected
                )
                if (inputsSatisfied) {

                    // Make a mutable copy of our inputs
                    const nodeInputs = { ...conn.node.inputs }

                    // Here is where we can transform our data
                    conn.node.type.inputs?.forEach(inputDef => {
                        const inputName = inputDef.name ?? inputDef

                        // if a single array is passed, flatten it
                        if (nodeInputs[inputName].length == 1)
                            nodeInputs[inputName] = nodeInputs[inputName].flat()

                        // option: pass a single value instead of an array
                        if (inputDef.expectSingleValue)
                            // use last value in array
                            nodeInputs[inputName] = nodeInputs[inputName][nodeInputs[inputName].length - 1]
                    })

                    // increment run counter
                    node.timesRan++

                    // error tracking
                    try {
                        // call node's input ready function
                        watch(
                            conn.node.type.onInputsReady?.bind(conn.node)(nodeInputs)
                        )
                    }
                    catch (error) {
                        reportError(conn.node.id, {
                            type: conn.node.type.id,
                            message: error.message,
                            // fullError: error,
                        })
                    }
                }
            })
        })
    }
}


function prepEdge(edge) {
    // TO DO: parse edge names for variable-length handle lists
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
