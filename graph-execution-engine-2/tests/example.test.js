import fs from "fs/promises"
import { runFlow } from "../index.js"
import nodeTypes from "../nodes/index.js"

fs.readFile("./example.json").then(fileContents => {
    const { nodes, edges } = JSON.parse(fileContents)

    runFlow({
        nodes,
        edges,
        nodeTypes
    })
})