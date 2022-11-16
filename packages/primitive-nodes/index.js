import Number from "./Number"
import Text from "./Text"

const nodes = [Number, Text]

export default Object.fromEntries(nodes.map(node => [node.id, node]))