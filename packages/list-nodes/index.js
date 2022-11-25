import Repeat from "./Repeat.js"

const nodes = [Repeat]

export default Object.fromEntries(nodes.map(node => [node.id, node]))