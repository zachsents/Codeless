import chalk from "chalk"
import util from "util"

import { Graph } from "../Graph.js"
import { NodeDefinition } from "../NodeDefinition.js"
import { generateGraph } from "./generate-graph.js"

const randomNumberState = {
    min: 2,
    max: 5,
    integer: true
}

// load definitions
await NodeDefinition.registerPackage(new URL("./example-nodes/index.js", import.meta.url))

// 1. Multiple & Long-Running Operations
console.log(chalk.bold("\n1. Multiple & Long-Running Operations"))
const graphString1 = generateGraph(`
random-number_1.$ -> power_1.base
random-number_2.$ -> power_1.power
random-number_3.$ -> write-equation_1.$nums.0
random-number_4.$ -> write-equation_1.$nums.1
random-number_5.$ -> write-equation_1.$nums.2
power_1.result -> print_1.$
write-equation_1.equation -> print_2.$
`, {
    "random-number_1": randomNumberState,
    "random-number_2": randomNumberState,
    "random-number_3": randomNumberState,
    "random-number_4": randomNumberState,
    "random-number_5": randomNumberState,
})
const graph1 = new Graph(graphString1)
await graph1.run()

// console.log(util.inspect(result, false, 5, true))


// 2. All Instant
console.log(chalk.bold("\n2. All Instant"))
const graphString2 = generateGraph(`
random-number_3.$ -> write-equation_1.$nums.0
random-number_4.$ -> write-equation_1.$nums.1
random-number_5.$ -> write-equation_1.$nums.2
write-equation_1.equation -> print_2.$
`, {
    "random-number_3": randomNumberState,
    "random-number_4": randomNumberState,
    "random-number_5": randomNumberState,
})
const graph2 = new Graph(graphString2)
await graph2.run()


// 3. Setup Payload
console.log(chalk.bold("\n3. Setup Payload"))
const graphString3 = generateGraph(`
pass-payload_1.result -> print_1.$
`)
const graph3 = new Graph(graphString3)
await graph3.run({ message: "this is the payload" })


// 4. Errors
console.log(chalk.bold("\n4. Errors"))
const graphString4 = generateGraph(`
pass-payload_1.result -> error_1.$
error_1.result -> print_1.$
`)
const graph4 = new Graph(graphString4)
const result4 = await graph4.run()
console.log(result4.errors)


// 5. Multiple Publishes
console.log(chalk.bold("\n5. Multiple Publishes"))
const graphString5 = generateGraph(`
looper_1.$ -> write-equation_1.$nums.0
random-number_4.$ -> write-equation_1.$nums.1
random-number_5.$ -> write-equation_1.$nums.2
write-equation_1.equation -> print_1.$
looper_1.$ -> print_2.$
`, {
    "random-number_4": randomNumberState,
    "random-number_5": randomNumberState,
})
const graph5 = new Graph(graphString5)
const result5 = await graph5.run()


// 6. Inputs & Outputs
console.log(chalk.bold("\n6. Inputs & Outputs"))
console.log(util.inspect(result5, false, 5, true))


console.log(chalk.bold.green("\nAll tests complete."))