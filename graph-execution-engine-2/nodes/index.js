import MathNodes from "./math.js"
import TimingNodes from "./timing.js"
import PrimitiveNodes from "./primitive.js"
import UtilNodes from "./util.js"
import DebugNodes from "./debug.js"
import MiscNodes from "./misc.js"

const BaseNodeTypes = {
    ...MathNodes,
    ...TimingNodes,
    ...PrimitiveNodes,
    ...UtilNodes,
    ...DebugNodes,
    ...MiscNodes,
}

export function loadNodeTypes(plugins = []) {

    const pluginNodeTypes = plugins
        // modify plugin node types to prefix them with plugin name
        .map(plugin => {
            const { name, nodeTypes } = typeof plugin == "function" ? plugin() : plugin
            return Object.fromEntries(
                Object.entries(nodeTypes).map(([nodeTypeId, nodeTypeData]) => {
                    const newId = `${name}/${nodeTypeId}`
                    return [newId, {
                        ...nodeTypeData,
                        id: newId
                    }]
                })
            )
        })
        // combine into one object to merge with base node types
        .reduce((accum, current) => ({
            ...accum,
            ...current
        }), {})


    return {
        ...BaseNodeTypes,
        ...pluginNodeTypes
    }
}