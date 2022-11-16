import RandomNumber from "./RandomNumber"
import Sum from "./Sum"

const nodes = [RandomNumber, Sum]

export default Object.fromEntries(nodes.map(node => [node.id, node]))