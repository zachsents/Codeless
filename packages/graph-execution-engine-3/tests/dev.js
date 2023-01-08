import fs from "fs/promises"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import util from "util"

import { runFlow } from "../index.js"

import ExampleAction from "./ExampleAction.js"
import ExampleDataSource from "./ExampleDataSource.js"
import ExampleTransform from "./ExampleTransform.js"

const testGraph = JSON.parse(
    await fs.readFile(dirname(fileURLToPath(import.meta.url)) + "\\test_graph.json", "utf-8")
)

console.log("Running test flow.")

const result = await runFlow({
    nodes: testGraph.nodes,
    edges: testGraph.edges,
    nodeTypes: Object.fromEntries(
        [ExampleAction, ExampleDataSource, ExampleTransform].map(type => [type.id, type])
    ),
})

console.log("Done. Here's the result:")
console.log(
    util.inspect(result, {
        depth: null,
        colors: true,
    })
)