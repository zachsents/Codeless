import Number from "./Number.js"
import Text from "./Text.js"

const nodes = [Number, Text]

export default Object.fromEntries(nodes.map(node => [node.id, node]))