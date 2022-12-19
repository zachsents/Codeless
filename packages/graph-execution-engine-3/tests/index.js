import fs from "fs/promises"
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { runFlow } from "../index.js"

import ExampleAction from "./ExampleAction.js"
import ExampleDataSource from "./ExampleDataSource.js"
import ExampleTransform from "./ExampleTransform.js"

const testGraph = JSON.parse(
    await fs.readFile(dirname(fileURLToPath(import.meta.url)) + "\\test_graph.json", "utf-8")
)

await runFlow({
    nodes: testGraph.nodes,
    edges: testGraph.edges,
    nodeTypes: Object.fromEntries(
        [ExampleAction, ExampleDataSource, ExampleTransform].map(type => [type.id, type])
    ),
})