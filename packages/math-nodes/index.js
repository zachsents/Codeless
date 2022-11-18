import RandomNumber from "./RandomNumber.js"
import Sum from "./Sum.js"

const nodes = [RandomNumber, Sum]

export default Object.fromEntries(nodes.map(node => [node.id, node]))