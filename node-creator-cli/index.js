#!/usr/bin/env node

import chalk from "chalk"
import inq from "inquirer"
import { createSpinner } from "nanospinner"
import fs from "fs/promises"
import { fileURLToPath } from "url"
import path from "path"


const ClientNodesPath = "./client-nodes"
const ServerNodesPath = "./server-nodes/src"


// check if we're in project root
try {
    await fs.readdir(ClientNodesPath)
}
catch (err) {
    console.error(chalk.red(`
Node Creator CLI must be run from project root.
`))
    process.exit(1)
}


console.log(chalk.bgBlue(`
Let's create a new node!
`))


// Ask questions

const { packageName } = await inq.prompt({
    name: "packageName",
    type: "input",
    message: "Package?",
    default: "basics",
})

const { id } = await inq.prompt({
    name: "id",
    type: "input",
    message: "ID?",
})
const splitId = id.split(":")


// check if file exists already
const clientPath = path.join(ClientNodesPath, packageName, splitId[1] + ".jsx")
const serverPath = path.join(ServerNodesPath, packageName, splitId[1] + ".js")
try {
    await fs.readFile(clientPath, "utf-8")
    console.error(chalk.red(`
${packageName}/${splitId[1]}.jsx exists already.
`))
    process.exit(1)
}
catch (err) { }

try {
    await fs.readFile(serverPath, "utf-8")
    console.error(chalk.red(`
${packageName}/${splitId[1]}.js exists already.
`))
    process.exit(1)
}
catch (err) { }


const { name } = await inq.prompt({
    name: "name",
    type: "input",
    message: "Name?",
    default: splitId[1]?.replaceAll(/[A-Z]/g, " $&").trim()
})

const { description } = await inq.prompt({
    name: "description",
    type: "input",
    message: "Description?",
})

const { icon } = await inq.prompt({
    name: "icon",
    type: "input",
    message: "Icon?",
})

let { color } = await inq.prompt({
    name: "color",
    type: "input",
    message: "Color?",
    default: "none",
})
color = color == "none" ? "" : color

let { badge } = await inq.prompt({
    name: "badge",
    type: "input",
    message: "Badge?",
    default: "none",
})
badge = badge == "none" ? "" : badge

const inputs = await loopQuestion("Input Name?")
const outputs = await loopQuestion("Output Name?")

const { overrideComponents } = await inq.prompt({
    name: "overrideComponents",
    type: "checkbox",
    message: "Include override components?",
    choices: [
        { name: "renderName" },
        { name: "renderNode" },
        { name: "configuration" },
    ]
})
const renderName = overrideComponents.includes("renderName")
const renderNode = overrideComponents.includes("renderNode")
const configuration = overrideComponents.includes("configuration")

const { eventHandlers } = await inq.prompt({
    name: "eventHandlers",
    type: "checkbox",
    message: "Include event handlers?",
    choices: [
        { name: "onStart" },
        { name: "onInputsReady" },
    ]
})
const onStart = eventHandlers.includes("onStart")
const onInputsReady = eventHandlers.includes("onInputsReady")


// Create client node file

const clientTemplate = await fs.readFile(
    fileURLToPath(new URL("./ClientTemplate.jsx", import.meta.url)),
    "utf-8"
)

const fillIns = {
    id,
    name,
    description,
    icon,
    color: color && putOnNewLine(`color: "${color}",`),
    badge: badge && putOnNewLine(`badge: "${badge}",`),
    inputs: inputs.map(input => `"${input}"`).join(", "),
    outputs: outputs.map(output => `"${output}"`).join(", "),

    renderName: renderName ? "renderName: ({ state }) => ``,\n" : "",

    renderNode: renderNode ?
        `renderNode: ({ state, setState }) => {
        return (
            <></>
        )
    },
    ` : "",

    configuration: configuration ?
        `configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="">

                    </ControlLabel>
                </Control>            
            </ControlStack>
        )
    },
    ` : "",

    onStart: onStart ?
        `onStart(setupPayload) {
        this.publish({ ${outputs.map(output => `${output}: null`).join(", ")} })
    },` : "",

    onInputsReady: onInputsReady ?
        `onInputsReady({ ${inputs.join(", ")} }) {
        this.publish({ ${outputs.map(output => `${output}: null`).join(", ")} })
    },` : "",
}

// make replacements
const clientContent = clientTemplate.replace(/\/\* (\S+) \*\//g, (_, variable) => fillIns[variable] ?? "")


// Create server node file

const serverTemplate = await fs.readFile(
    fileURLToPath(new URL("./ServerTemplate.js", import.meta.url)),
    "utf-8"
)

const serverContent = serverTemplate.replace(/\/\* (\S+) \*\//g, (_, variable) => fillIns[variable] ?? "")


// write files out
console.log()
const spinner = createSpinner().start()
try {
    await fs.writeFile(clientPath, clientContent)
    await fs.writeFile(serverPath, serverContent)
    spinner.success({ text: `Successfully created "${name}" 😁` })
}
catch (err) {
    spinner.error({ text: "Failed to write file." })
    process.exit(1)
}

console.log("\n")


function putOnNewLine(str, spaces = 4) {
    return `\n${" ".repeat(spaces)}${str}`
}

async function loopQuestion(prompt, flag = "finished") {
    const inputs = []
    while (inputs[inputs.length - 1] != flag) {
        const { input } = await inq.prompt({
            name: "input",
            type: "input",
            message: prompt,
            default: flag,
        })
        inputs.push(input)
    }
    return inputs.slice(0, -1)
}