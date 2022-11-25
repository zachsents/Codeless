import RandomNumber from "./RandomNumber.js"
import Sum from "./Sum.js"
import Multiply from "./Multiply.js"
import Divide from "./Divide.js"
import Average from "./Average.js"

const nodes = [RandomNumber, Sum, Multiply, Divide, Average]

export default Object.fromEntries(nodes.map(node => [node.id, node]))