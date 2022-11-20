import RandomNumber from "./RandomNumber.js"
import Sum from "./Sum.js"
import Multiply from "./Multiply.js"

const nodes = [RandomNumber, Sum, Multiply]

export default Object.fromEntries(nodes.map(node => [node.id, node]))