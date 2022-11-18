import Bind from "./Bind.js"
import Unbind from "./Unbind.js"
import Print from "./Print.js"

const nodes = [Bind, Unbind, Print]

export default Object.fromEntries(nodes.map(node => [node.id, node]))