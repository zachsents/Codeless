import Bind from "./Bind"
import Unbind from "./Unbind"
import Print from "./Print"

const nodes = [Bind, Unbind, Print]

export default Object.fromEntries(nodes.map(node => [node.id, node]))