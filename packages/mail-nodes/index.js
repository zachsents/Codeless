import TestMail from "./TestMail.js"

const nodes = [TestMail]

export default Object.fromEntries(nodes.map(node => [node.id, node]))