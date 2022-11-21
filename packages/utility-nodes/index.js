import Bind from "./Bind.js"
import Unbind from "./Unbind.js"
import Print from "./Print.js"
import Memo from "./Memo.js"

const nodes = [Bind, Unbind, Print, Memo]

export default Object.fromEntries(nodes.map(node => [node.id, node]))